import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import anime from 'animejs';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './index.styl';

class SliderScroller extends Component {
	constructor(props) {
		super(props);

		this.setClasses = this.setClasses.bind(this);
	}

	static defaultProps = {
		className: '',
		offsetLeft: 0,
		offsetRight: 0,
		shadows: false,
	};

	sliderScrollRef = element => {
		if (!element) return;
		this.sliderScroller = element;
	};

	setClasses() {
		const sliderScrollerWrap = this.sliderScroller.querySelector('.slider-scroller__wrap-scroll');
		const removeClass = direction => {
			switch (direction) {
				case 'right':
				case 'both':
				case 'left':
					this.sliderScroller.classList.remove(`slider-scroller_scroll-${direction}`);
					break;
				default:
					this.sliderScroller.classList.remove('slider-scroller_scroll-right');
					this.sliderScroller.classList.remove('slider-scroller_scroll-both');
					this.sliderScroller.classList.remove('slider-scroller_scroll-left');
			}
		};
		const addDirectionClass = direction => {
			if (!this.sliderScroller.classList.contains(`slider-scroller_scroll-${direction}`)) {
				this.sliderScroller.classList.add(`slider-scroller_scroll-${direction}`);
			}
		};

		if (sliderScrollerWrap.scrollWidth > this.sliderScroller.clientWidth) {
			let scrollShiftRight = sliderScrollerWrap.scrollLeft + sliderScrollerWrap.clientWidth;

			if (sliderScrollerWrap.scrollLeft === 0 || sliderScrollerWrap.scrollLeft < this.props.offsetLeft) {
				removeClass('both');
				addDirectionClass('right');
			} else if (
				sliderScrollerWrap.scrollLeft >= this.props.offsetLeft &&
				scrollShiftRight + this.props.offsetRight <= sliderScrollerWrap.scrollWidth
			) {
				removeClass('right');
				removeClass('left');
				addDirectionClass('both');
			} else if (scrollShiftRight + this.props.offsetRight >= sliderScrollerWrap.scrollWidth) {
				removeClass('both');
				addDirectionClass('left');
			}
		} else {
			removeClass();
		}
	}

	onScroll = () => this.setClasses();

	componentDidMount = () => {
		this.setClasses();

		new ResizeSensor(this.sliderScroller, this.setClasses);
		new ResizeSensor(this.sliderScroller.querySelector('.slider-scroller__wrap'), this.setClasses);
	};

	render() {
		const { children, className, shadows } = this.props;

		let componentClasses = ClassNames({
			[className]: !!className,
			'slider-scroller': true,
		});

		let animationProgress = 0;

		const handleClickArrowLeft = event => {
			const sliderScrollerWrap = event.currentTarget.parentElement.querySelector('.slider-scroller__wrap-scroll'),
				shiftValue = Math.round(sliderScrollerWrap.clientWidth / 2);

			if (animationProgress !== 100) anime.remove(sliderScrollerWrap);

			anime({
				targets: sliderScrollerWrap,
				scrollLeft: {
					value: Math.max(sliderScrollerWrap.scrollLeft - shiftValue, 0),
					duration: 300,
					easing: 'easeInOutQuad',
					delay: 0,
				},
				update: anim => (animationProgress = anim.progress),
			});
		};
		const handleClickArrowRight = event => {
			const sliderScrollerWrap = event.currentTarget.parentElement.querySelector('.slider-scroller__wrap-scroll'),
				shiftValue = Math.round(sliderScrollerWrap.clientWidth / 2);

			if (animationProgress !== 100) anime.remove(sliderScrollerWrap);

			anime({
				targets: sliderScrollerWrap,
				scrollLeft: {
					value: Math.min(
						sliderScrollerWrap.scrollLeft + shiftValue,
						sliderScrollerWrap.scrollWidth - sliderScrollerWrap.clientWidth
					),
					duration: 300,
					easing: 'easeInOutQuad',
					delay: 0,
				},
				update: anim => (animationProgress = anim.progress),
			});
		};

		return (
			<div ref={this.sliderScrollRef} className={componentClasses}>
				<div className="slider-scroller__wrap-overflow">
					<div className="slider-scroller__wrap-scroll" onScroll={this.onScroll}>
						<div className="slider-scroller__wrap" children={<div className="slider-scroller__wrap-content">{children}</div>} />
					</div>
				</div>

				<span className="slider-scroller__arrow slider-scroller__arrow_left" onClick={handleClickArrowLeft}>
					<FontAwesomeIcon icon={['fal', 'angle-left']} />
				</span>
				{shadows ? <div className="slider-scroller__arrow-shadow slider-scroller__arrow-shadow_direction_left" /> : null}

				<span className="slider-scroller__arrow slider-scroller__arrow_right" onClick={handleClickArrowRight}>
					<FontAwesomeIcon icon={['fal', 'angle-right']} />
				</span>
				{shadows ? <div className="slider-scroller__arrow-shadow slider-scroller__arrow-shadow_direction_right" /> : null}
			</div>
		);
	}
}

SliderScroller.propTypes = {
	className: PropTypes.string,
	shadows: PropTypes.bool,
	offsetLeft: PropTypes.number,
	offsetRight: PropTypes.number,
};

export default SliderScroller;
