import React, { Component } from 'react';
import ClassNames from 'classnames';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MuiCard from '@material-ui/core/Card';
import Slider from 'react-slick';
import ReactPlayer from 'react-player';

import { truncate, kiloFormat } from 'src/helpers/utils';

import Duration from 'src/components/Duration';
import Arrow from './Arrow';

import './Card.styl';

class Card extends Component {
	constructor(props) {
		super(props);

		this.state = {
			media: props.media.map(mediaEl => {
				if (mediaEl.type === 'video') {
					mediaEl.playing = false;
				}

				mediaEl.duration = mediaEl.type === 'image' ? 5 : 0;

				return mediaEl;
			}),
		};

		if (!props.past && props.media.some(mediaEl => mediaEl.type === 'video')) {
			this.state.hasVideo = true;
			this.state.videoPlaying = false;
			this.state.played = 0;
		}
	}

	sliderRef = element => {
		if (!element) return;
		this.sliderGallery = element;
	};

	playerRef = element => {
		if (!element) return;

		this.setState({
			media: this.state.media.map((mediaEl, index) => {
				if (mediaEl.type === 'video' && index === +element.wrapper.getAttribute('index')) {
					mediaEl.player = element;
				}

				return mediaEl;
			}),
		});
	};

	sliderAutoplay = (nextSlide, primaryDelay) => {
		let currentSlide = nextSlide !== undefined && nextSlide !== null ? nextSlide : this.state.activeGallerySlide,
			activeMediaEl = this.state.media[currentSlide],
			delay = activeMediaEl.type === 'video' ? 0 : 0;

		primaryDelay = primaryDelay || 0;

		clearTimeout(this.state.sliderAutoplayTimer);

		if (this.state.media.length > currentSlide + 1) {
			this.setState({
				sliderAutoplayTimer: setTimeout(() => {
					this.sliderGallery.slickNext();

					this.setState({
						sliderAutoplayTimer: setTimeout(this.sliderAutoplay, 0),
					});
				}, activeMediaEl.duration * 1000 + delay + primaryDelay),
			});
		}
	};

	onDurationPlayer = duration => {
		this.setState({
			media: this.state.media.map(mediaEl => {
				if (mediaEl.type === 'video') {
					mediaEl.duration = duration;
				}

				return mediaEl;
			}),
		});
	};

	onProgressPlayer = state => this.setState({ played: state.played });

	onMouseEnterCard = () => {
		if (this.props.past) return;

		let activeMediaEl = this.state.media.length > 1 ? this.state.media[this.state.activeGallerySlide] : this.state.media[0];

		if (this.state.media.length > 1) {
			this.sliderAutoplay(null, 500);
		}

		if (activeMediaEl.type === 'video') {
			this.setState({
				playerTimer: setTimeout(() => {
					this.setState({
						media: this.state.media.map((mediaEl, index) => {
							if (mediaEl.type === 'video' && (this.state.media.length === 1 || index === this.state.activeGallerySlide)) {
								mediaEl.playing = true;
							}

							return mediaEl;
						}),
					});
				}, 500),
			});

			this.setState({ videoPlaying: true });
		}
	};

	onMouseLeaveCard = () => {
		if (this.props.past) return;

		let activeMediaEl = this.state.media.length > 1 ? this.state.media[this.state.activeGallerySlide] : this.state.media[0];

		if (this.state.media.length > 1) {
			clearTimeout(this.state.sliderAutoplayTimer);
		}

		if (activeMediaEl.type === 'video') {
			clearTimeout(this.state.playerTimer);

			this.setState({
				media: this.state.media.map(mediaEl => {
					if (mediaEl.type === 'video') {
						mediaEl.player.seekTo(0);
						mediaEl.playing = false;
					}

					return mediaEl;
				}),
			});

			this.setState({ videoPlaying: false });
		}
	};

	onClickCard = () => {};

	render() {
		const { activeGallerySlide } = this.state;
		const publicationCard = this.props;

		const sliderGallerySettings = {
			className: 'publication-card__slider-gallery',
			accessibility: false,
			prevArrow: <Arrow direction="prev" />,
			nextArrow: <Arrow direction="next" />,
			draggable: false,
			infinite: false,
			speed: 250,
			onInit: () => {
				this.setState({ activeGallerySlide: 0 });
			},
			beforeChange: (currentSlide, nextSlide) => {
				this.setState({
					activeGallerySlide: nextSlide,
				});

				if (!publicationCard.past) {
					clearTimeout(this.state.sliderAutoplayTimer);
					this.sliderAutoplay(nextSlide);

					if (this.state.hasVideo) {
						this.setState({
							media: this.state.media.map((mediaEl, index) => {
								if (publicationCard.media[nextSlide].type === 'video' && index === nextSlide) {
									mediaEl.playing = true;
									this.setState({ videoPlaying: true });
								} else if (mediaEl.type === 'video' && index !== nextSlide) {
									mediaEl.player.seekTo(0);
									mediaEl.playing = false;
								} else if (publicationCard.media[nextSlide].type !== 'video' && index !== nextSlide) {
									this.setState({ videoPlaying: false });
								}

								return mediaEl;
							}),
						});
					}
				}
			},
		};

		let cardClasses = ClassNames({
				'publication-card': true,
				['publication-card_' + publicationCard.type]: true,
				'publication-card_past': publicationCard.past,
				'publication-card_video-playing': !publicationCard.past && this.state.videoPlaying,
				'publication-card_single': publicationCard.media.length === 1,
			}),
			socialNetworkProfileClasses = ClassNames({
				'publication-card__social-network-profile': true,
				['publication-card__social-network-profile_' + publicationCard.socialProfile.network]: true,
			});

		return (
			<div className={cardClasses}>
				<div className="publication-card__profile">
					<div className="publication-card__profile-avatar">
						<div className={socialNetworkProfileClasses}>
							<FontAwesomeIcon icon={['fab', publicationCard.socialProfile.network]} />
						</div>
						<div className="publication-card__profile-photo publication-card__profile-photo_theme-color-5">
							<img src={publicationCard.socialProfile.avatar} alt="" />
						</div>
					</div>
					<div className="publication-card__profile-info">
						<div className="publication-card__profile-name">{publicationCard.socialProfile.name}</div>
						<div className="publication-card__profile-publication-date">
							в <span>{moment(moment.unix(publicationCard.time)).format('HH:mm')}</span>
						</div>
					</div>
				</div>

				{publicationCard.media.length === 1 ? (
					<MuiCard
						className="publication-card__wrap"
						onMouseEnter={this.onMouseEnterCard}
						onMouseLeave={this.onMouseLeaveCard}
						onClick={this.onClickCard}
					>
						<div className="publication-card__media">
							{publicationCard.media[0].type === 'video' ? (
								<div className="publication-card__badges">
									<div className="publication-card__badge-media-type">
										<FontAwesomeIcon icon={['fal', 'video']} />
									</div>
									{!publicationCard.past ? (
										<div className="publication-card__badge-video-timer">
											<Duration seconds={this.state.media[0].duration * (1 - this.state.played)} />
										</div>
									) : null}
								</div>
							) : null}
							{publicationCard.media[0].type === 'video' ? (
								<ReactPlayer
									className="publication-card__video"
									width="100%"
									height="100%"
									ref={this.playerRef}
									index={0}
									url={publicationCard.media[0].videoUrl}
									playing={this.state.media[0].playing}
									onDuration={this.onDurationPlayer}
									onProgress={this.onProgressPlayer}
									muted
									loop
								/>
							) : (
								<div className="publication-card__image">
									<img src={publicationCard.media[0].url} alt="" />
								</div>
							)}
						</div>
						<div className="publication-card__content">
							{!publicationCard.past && publicationCard.type === 'publication' ? (
								<div className="publication-card__content-wrap">{truncate(publicationCard.text, 74)}</div>
							) : publicationCard.past && publicationCard.type === 'publication' ? (
								<div className="publication-card__reactions-wrap">
									<div className="publication-card__reaction">
										<FontAwesomeIcon icon={['fas', 'heart']} />
										{kiloFormat(publicationCard.likes)}
									</div>
									<div className="publication-card__reaction">
										<FontAwesomeIcon icon={['fas', 'comment']} />
										{kiloFormat(publicationCard.comments)}
									</div>
									<div className="publication-card__reaction">
										<FontAwesomeIcon icon={['fas', 'bullhorn']} />
										{kiloFormat(publicationCard.shares)}
									</div>
								</div>
							) : publicationCard.past && publicationCard.type === 'story' ? (
								<div className="publication-card__reactions-wrap">
									<div className="publication-card__reaction">
										<FontAwesomeIcon icon={['far', 'eye']} />
										{publicationCard.media[0].views.toLocaleString()}
									</div>
								</div>
							) : null}
						</div>
					</MuiCard>
				) : publicationCard.media.length > 1 ? (
					<MuiCard className="publication-card__wrap" onMouseEnter={this.onMouseEnterCard} onMouseLeave={this.onMouseLeaveCard}>
						<div className="publication-card__slider-gallery-counter">
							{activeGallerySlide + 1 + ' из ' + publicationCard.media.length}
						</div>
						<Slider ref={this.sliderRef} {...sliderGallerySettings}>
							{publicationCard.media.map((mediaEl, index) => (
								<div className="publication-card__slider-gallery-item" key={mediaEl.id} onClick={this.onClickCard}>
									<div className="publication-card__media">
										{mediaEl.type === 'video' ? (
											<div className="publication-card__badges">
												<div className="publication-card__badge-media-type">
													<FontAwesomeIcon icon={['fal', 'video']} />
												</div>
												{!publicationCard.past ? (
													<div className="publication-card__badge-video-timer">
														<Duration seconds={this.state.media[index].duration * (1 - this.state.played)} />
													</div>
												) : null}
											</div>
										) : publicationCard.past && mediaEl.type === 'video' ? (
											<div className="publication-card__badges">
												<div className="publication-card__badge-media-type">
													<FontAwesomeIcon icon={['fal', 'video']} />
												</div>
											</div>
										) : null}
										{mediaEl.type === 'video' ? (
											<ReactPlayer
												className="publication-card__video"
												width="100%"
												height="100%"
												ref={this.playerRef}
												index={index}
												url={mediaEl.videoUrl}
												playing={this.state.media[index].playing}
												onDuration={this.onDurationPlayer}
												onProgress={this.onProgressPlayer}
												muted
												loop
											/>
										) : (
											<div className="publication-card__image">
												<img src={mediaEl.url} alt="" />
											</div>
										)}
									</div>
									{publicationCard.type === 'story' && publicationCard.past ? (
										<div className="publication-card__content">
											<div className="publication-card__reactions-wrap">
												<div className="publication-card__reaction">
													<FontAwesomeIcon icon={['far', 'eye']} />
													{mediaEl.views.toLocaleString()}
												</div>
											</div>
										</div>
									) : null}
								</div>
							))}
						</Slider>
						{publicationCard.type === 'publication' ? (
							<div className="publication-card__content">
								{!publicationCard.past ? (
									<div className="publication-card__content-wrap">{truncate(publicationCard.text, 74)}</div>
								) : (
									<div className="publication-card__reactions-wrap">
										<div className="publication-card__reaction">
											<FontAwesomeIcon icon={['fas', 'heart']} />
											{kiloFormat(publicationCard.likes)}
										</div>
										<div className="publication-card__reaction">
											<FontAwesomeIcon icon={['fas', 'comment']} />
											{kiloFormat(publicationCard.comments)}
										</div>
										<div className="publication-card__reaction">
											<FontAwesomeIcon icon={['fas', 'bullhorn']} />
											{kiloFormat(publicationCard.shares)}
										</div>
									</div>
								)}
							</div>
						) : null}
					</MuiCard>
				) : null}
			</div>
		);
	}
}

export default Card;
