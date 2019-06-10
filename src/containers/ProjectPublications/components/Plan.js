import React from 'react';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ButtonBase from '@material-ui/core/ButtonBase';

import SliderScroller from 'src/components/SliderScroller';
import Card from './Card';

import './Plan.styl';

const Plan = () => {
	const calendar = [
		{
			date: moment()
				.subtract(29, 'days')
				.unix(),
			publications: [
				{
					id: 'asdokqwopkd2-30d230-ei32',
					type: 'publication',
					likes: 1400,
					comments: 18,
					shares: 219,
					media: [
						{
							id: 'kasldj2l3kj32jdl',
							type: 'image',
							url: 'https://pp.userapi.com/c846418/v846418404/f2278/n_ec8L8CiaE.jpg',
						},
					],
					text: 'Львы почти весь день спят! В жаркий период они тратят на сон до 20 часов в сутки. Как хочется быть львом.. 💙🖤',
					socialProfile: {
						avatar: 'https://pp.userapi.com/c638818/v638818319/56c21/EvIVRDLDNBQ.jpg',
						name: 'Виктория Григорьева',
						network: 'vk',
					},
					time: 1538926500,
				},
				{
					id: 'opwjd1=09jud9012jdi2jd',
					type: 'story',
					media: [
						{
							id: 'salkdj2kl3jclk',
							type: 'image',
							url: 'https://pp.userapi.com/c846123/v846123871/ed42d/5tTGUgSXb_k.jpg',
							views: 124257,
						},
						{
							id: 'saldm232opej-0wejew0kc',
							type: 'video',
							previewUrl: 'https://pp.userapi.com/c846418/v846418404/f2278/n_ec8L8CiaE.jpg',
							videoUrl: '/videos/d6158efaaf.720.mp4',
							views: 123,
						},
						{
							id: 'wklmdkl3m2fokwmeopfeko=',
							type: 'image',
							url: 'https://pp.userapi.com/c846219/v846219869/fe79d/EF6fwjLIHJA.jpg',
							views: 24257,
						},
					],
					socialProfile: {
						avatar: 'https://pp.userapi.com/c638818/v638818319/56c21/EvIVRDLDNBQ.jpg',
						name: 'Виктория Григорьева',
						network: 'vk',
					},
					time: 1536420953,
				},
			],
			today: false,
		},
		{
			date: moment().unix(),
			publications: [
				{
					id: 'opdj23jd-023ie02-3i-e03',
					type: 'publication',
					likes: 0,
					comments: 0,
					shares: 0,
					media: [
						{
							id: 'asldj23jfio2ejwfewjf09j3',
							type: 'image',
							url: 'https://pp.userapi.com/c846418/v846418404/f2278/n_ec8L8CiaE.jpg',
						},
					],
					text: 'Львы почти весь день спят! В жаркий период они тратят 💙🖤',
					socialProfile: {
						avatar: 'https://pp.userapi.com/c638818/v638818319/56c21/EvIVRDLDNBQ.jpg',
						name: 'Виктория Григорьева',
						network: 'vk',
					},
					time: 1539031873,
				},
			],
			today: true,
		},
		{
			date: moment()
				.add(1, 'days')
				.unix(),
			publications: [
				{
					id: 'apdjk-0wqid230=dj20jd23d',
					type: 'publication',
					likes: 0,
					comments: 0,
					shares: 0,
					media: [
						{
							id: 'skaldjj230jd032093',
							type: 'video',
							previewUrl: 'https://pp.userapi.com/c846418/v846418404/f2278/n_ec8L8CiaE.jpg',
							videoUrl: '/videos/0e0bbc6cbd.1080.mp4',
						},
						{
							id: 'saldkop2k30-d23-0',
							type: 'image',
							url: 'https://pp.userapi.com/c846418/v846418404/f2278/n_ec8L8CiaE.jpg',
						},
						{
							id: 'saldkop2k30-d23-0',
							type: 'image',
							url: 'https://pp.userapi.com/c846418/v846418404/f2278/n_ec8L8CiaE.jpg',
						},
						{
							id: 'ldm230jd-320dk-23-',
							type: 'image',
							url: 'https://pp.userapi.com/c846418/v846418404/f2278/n_ec8L8CiaE.jpg',
						},
					],
					text:
						'Львы почти весь день спят! В жаркий период они тратят Львы почти весь день спят! В жаркий период они тратят 💙🖤',
					socialProfile: {
						avatar: 'https://pp.userapi.com/c638818/v638818319/56c21/EvIVRDLDNBQ.jpg',
						name: 'Виктория Григорьева',
						network: 'vk',
					},
					time: 1539031873,
				},
				{
					id: 'asojdwopqkd-023-id-230od-0',
					type: 'publication',
					likes: 0,
					comments: 0,
					shares: 0,
					media: [
						{
							id: 'asdopqjko20j0dj9=j',
							type: 'image',
							url: 'https://pp.userapi.com/c846418/v846418404/f2278/n_ec8L8CiaE.jpg',
						},
					],
					text: 'Львы почти весь день спят! В жаркий период они тратят 💙🖤',
					socialProfile: {
						avatar: 'https://pp.userapi.com/c638818/v638818319/56c21/EvIVRDLDNBQ.jpg',
						name: 'Виктория Григорьева',
						network: 'vk',
					},
					time: 1539031873,
				},
				{
					id: 'asdopjqwpodkj20-id23-0dk',
					type: 'story',
					media: [
						{
							id: '2930i9udj209d2j3d',
							type: 'video',
							previewUrl: 'https://pp.userapi.com/c846418/v846418404/f2278/n_ec8L8CiaE.jpg',
							videoUrl: '/videos/d6158efaaf.720.mp4',
							views: 0,
						},
					],
					socialProfile: {
						avatar: 'https://pp.userapi.com/c638818/v638818319/56c21/EvIVRDLDNBQ.jpg',
						name: 'Виктория Григорьева',
						network: 'vk',
					},
					time: 1536420953,
				},
				{
					id: 'asldkwopdj203jdwe0-id0-',
					type: 'story',
					media: [
						{
							id: 'dkwdpowk23-0d230',
							type: 'video',
							previewUrl: 'https://pp.userapi.com/c846418/v846418404/f2278/n_ec8L8CiaE.jpg',
							videoUrl: '/videos/27b98552ab.720.mp4',
							views: 0,
						},
						{
							id: 'wekd30ejf0jf90wjf32+_',
							type: 'image',
							url: 'https://pp.userapi.com/c846123/v846123871/ed42d/5tTGUgSXb_k.jpg',
							views: 0,
						},
						{
							id: 'wpdok230-d32-d-od',
							type: 'image',
							url: 'https://pp.userapi.com/c846123/v846123871/ed42d/5tTGUgSXb_k.jpg',
							views: 0,
						},
						{
							id: 'wqldkj2o3jd23-d23-0e23',
							type: 'video',
							previewUrl: 'https://pp.userapi.com/c846418/v846418404/f2278/n_ec8L8CiaE.jpg',
							videoUrl: '/videos/d6158efaaf.720.mp4',
							views: 0,
						},
						{
							id: 'qwopdkpokdopkwqpdowqopd',
							type: 'video',
							previewUrl: 'https://pp.userapi.com/c846418/v846418404/f2278/n_ec8L8CiaE.jpg',
							videoUrl: '/videos/d6158efaaf.720.mp4',
							views: 0,
						},
						{
							id: 'ewopfkd2-3f32-0fjkoefkeowkfpweo',
							type: 'image',
							url: 'https://pp.userapi.com/c846219/v846219869/fe79d/EF6fwjLIHJA.jpg',
							views: 0,
						},
					],
					socialProfile: {
						avatar: 'https://pp.userapi.com/c638818/v638818319/56c21/EvIVRDLDNBQ.jpg',
						name: 'Виктория Григорьева',
						network: 'vk',
					},
					time: 1536420953,
				},
				{
					id: 'aslkdjwqopdj23=d0-23=d',
					type: 'publication',
					likes: 0,
					comments: 0,
					shares: 0,
					media: [
						{
							id: 'djwepdk2-3kd-203dk',
							type: 'video',
							previewUrl: 'https://pp.userapi.com/c846418/v846418404/f2278/n_ec8L8CiaE.jpg',
							videoUrl: '/videos/31088243_202098390573760_6268358743918903296_n.mp4',
						},
					],
					text: 'Львы почти весь день спят! В жаркий период они тратят 💙🖤',
					socialProfile: {
						avatar: 'https://pp.userapi.com/c638818/v638818319/56c21/EvIVRDLDNBQ.jpg',
						name: 'Виктория Григорьева',
						network: 'vk',
					},
					time: 1539031873,
				},
				{
					id: 'asodjwqojdwojd09w3jd03',
					type: 'publication',
					likes: 0,
					comments: 0,
					shares: 0,
					media: [
						{
							id: 'as;ldkweopdkweodk30dk',
							type: 'image',
							url: 'https://pp.userapi.com/c846418/v846418404/f2278/n_ec8L8CiaE.jpg',
						},
						{
							id: 'as;ldkweopdkweodk30dk',
							type: 'image',
							url: 'https://pp.userapi.com/c846418/v846418404/f2278/n_ec8L8CiaE.jpg',
						},
					],
					text: 'Львы почти весь день спят! В жаркий период они тратят 💙🖤',
					socialProfile: {
						avatar: 'https://pp.userapi.com/c638818/v638818319/56c21/EvIVRDLDNBQ.jpg',
						name: 'Виктория Григорьева',
						network: 'vk',
					},
					time: 1539031873,
				},
				{
					id: 'as;ldkwdl;wk;dlw',
					type: 'publication',
					likes: 0,
					comments: 0,
					shares: 0,
					media: [
						{
							id: 'aldkjwqdjowidj0329jd9w0ejd',
							type: 'image',
							url: 'https://pp.userapi.com/c846418/v846418404/f2278/n_ec8L8CiaE.jpg',
						},
					],
					text: 'Львы почти весь день спят! В жаркий период они тратят 💙🖤',
					socialProfile: {
						avatar: 'https://pp.userapi.com/c638818/v638818319/56c21/EvIVRDLDNBQ.jpg',
						name: 'Виктория Григорьева',
						network: 'vk',
					},
					time: 1539031873,
				},
			],
			today: false,
		},
		{
			date: moment()
				.add(2, 'days')
				.unix(),
			publications: [],
			today: false,
		},
		{
			date: moment()
				.add(3, 'days')
				.unix(),
			publications: [],
			today: false,
		},
	];

	const calendarDay = calendar.map((day, index) => {
		let date = moment.unix(day.date),
			pastDay = !day.today && moment().isAfter(date);

		return (
			<div className={'publications-plan__day' + (pastDay ? ' publications-plan__day_past' : '')} key={index}>
				<div className="publications-plan__day-header">
					<div className="publications-plan__day-header-date">{day.today ? 'сегодня' : moment(date).format('D MMMM')}</div>
					<div className="publications-plan__day-header-day-week">{moment(date).format('dddd')}</div>
				</div>
				<div
					className={
						'publications-plan__feed' + (!pastDay && day.publications.length ? ' publications-plan__feed_not-empty' : '')
					}
				>
					{!pastDay ? (
						<ButtonBase className="publications-plan__add-card publications-plan__add-card_publication">
							<FontAwesomeIcon icon={['fal', 'plus']} />
							{/*добавить*/}
							{/*<br />*/}
							пост
						</ButtonBase>
					) : null}
					{!pastDay ? (
						<ButtonBase className="publications-plan__add-card publications-plan__add-card_story">
							<FontAwesomeIcon icon={['fal', 'plus']} />
							{/*добавить*/}
							{/*<br />*/}
							история
						</ButtonBase>
					) : null}
					{day.publications.length ? (
						<SliderScroller className="publications-plan__feed-scroller" offsetRight={20} shadows>
							{day.publications.map(publication => {
								return <Card {...publication} past={pastDay} key={publication.id} />;
							})}
						</SliderScroller>
					) : null}
				</div>
			</div>
		);
	});

	return <div className="publications-plan">{calendarDay}</div>;
};

export default Plan;
