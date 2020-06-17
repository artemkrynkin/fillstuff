import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import ResizeSensor from 'css-element-queries/src/ResizeSensor';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonBase from '@material-ui/core/ButtonBase';

import styles from './index.module.css';

class SliderScroller extends Component {
	constructor(props) {
		super(props);

		this.setClasses = this.setClasses.bind(this);
	}

	static defaultProps = {
		classNamesInitial: {
			container: '',
			wrapOverflow: '',
			wrapScroll: '',
			wrapContent: '',
			arrowLeft: '',
			arrowRight: '',
			arrowShadowLeft: '',
			arrowShadowRight: '',
		},
		offsetLeft: 0,
		offsetRight: 0,
		shadows: false,
	};

	static propTypes = {
		classNames: PropTypes.shape({
			container: PropTypes.string,
			wrapOverflow: PropTypes.string,
			wrapScroll: PropTypes.string,
			wrapContent: PropTypes.string,
			arrowLeft: PropTypes.string,
			arrowRight: PropTypes.string,
			arrowShadowLeft: PropTypes.string,
			arrowShadowRight: PropTypes.string,
		}),
		shadows: PropTypes.bool,
		offsetLeft: PropTypes.number,
		offsetRight: PropTypes.number,
		children: PropTypes.node.isRequired,
	};

	sliderScrollRef = element => {
		if (!element) return;
		this.sliderScroller = element;
	};

	setClasses() {
		const sliderScrollerWrap = this.sliderScroller.querySelector(`.${styles.wrapScroll}`);
		const sliderScrollerWrapContent = this.sliderScroller.querySelector(`.${styles.wrapContent}`);

		const removeClass = direction => {
			switch (direction) {
				case 'right':
				case 'both':
				case 'left':
					this.sliderScroller.classList.remove(`scroll-${direction}`);
					break;
				default:
					this.sliderScroller.classList.remove('scroll-right');
					this.sliderScroller.classList.remove('scroll-both');
					this.sliderScroller.classList.remove('scroll-left');
			}
		};

		const addDirectionClass = direction => {
			if (!this.sliderScroller.classList.contains(`scroll-${direction}`)) {
				this.sliderScroller.classList.add(`scroll-${direction}`);
			}
		};

		if (sliderScrollerWrap.scrollWidth > sliderScrollerWrapContent.clientWidth) {
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

	handleClickArrow = (event, direction) => {
		const sliderScrollerWrap = event.currentTarget.parentElement.querySelector(`.${styles.wrapScroll}`);
		const shiftValue = Math.round(sliderScrollerWrap.clientWidth / 2);

		sliderScrollerWrap.scrollLeft =
			direction === 'left'
				? Math.max(sliderScrollerWrap.scrollLeft - shiftValue, 0)
				: Math.min(sliderScrollerWrap.scrollLeft + shiftValue, sliderScrollerWrap.scrollWidth - sliderScrollerWrap.clientWidth);
	};

	componentDidMount = () => {
		this.setClasses();

		new ResizeSensor(this.sliderScroller, this.setClasses);
		new ResizeSensor(this.sliderScroller.querySelector(`.${styles.wrapScroll}`), this.setClasses);
	};

	render() {
		const { shadows, children } = this.props;
		const classNames = { ...this.props.classNamesInitial, ...this.props.classNames };

		const containerClasses = ClassNames({
			...Object.fromEntries(
				classNames.container
					.split(' ')
					.filter(val => val)
					.map(key => [key, true])
			),
			[styles.container]: true,
		});
		const wrapOverflowClasses = ClassNames({
			...Object.fromEntries(
				classNames.wrapOverflow
					.split(' ')
					.filter(val => val)
					.map(key => [key, true])
			),
			[styles.wrapOverflow]: true,
		});
		const wrapScrollClasses = ClassNames({
			...Object.fromEntries(
				classNames.wrapScroll
					.split(' ')
					.filter(val => val)
					.map(key => [key, true])
			),
			[styles.wrapScroll]: true,
		});
		const wrapContentClasses = ClassNames({
			...Object.fromEntries(
				classNames.wrapContent
					.split(' ')
					.filter(val => val)
					.map(key => [key, true])
			),
			[styles.wrapContent]: true,
		});

		return (
			<div ref={this.sliderScrollRef} className={containerClasses}>
				<div className={wrapOverflowClasses}>
					<div className={wrapScrollClasses} onScroll={this.onScroll}>
						<div className={wrapContentClasses}>{children}</div>
					</div>
				</div>

				<ButtonBase className={`${classNames.arrowLeft}`} onClick={event => this.handleClickArrow(event, 'left')}>
					<FontAwesomeIcon icon={['fal', 'angle-left']} />
				</ButtonBase>
				{shadows ? <div className={`${classNames.arrowShadowLeft}`} /> : null}

				<ButtonBase className={`${classNames.arrowRight}`} onClick={event => this.handleClickArrow(event, 'right')}>
					<FontAwesomeIcon icon={['fal', 'angle-right']} />
				</ButtonBase>
				{shadows ? <div className={`${classNames.arrowShadowRight}`} /> : null}
			</div>
		);
	}
}

export default SliderScroller;
