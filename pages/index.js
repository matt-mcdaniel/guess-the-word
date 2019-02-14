import React from 'react';
import fetch from 'isomorphic-unfetch';
import Head from 'next/head';

const colors = ['red', 'yellow', 'blue', 'green', 'orange', 'purple', 'brown'];

class Home extends React.Component {
	state = {};
	static async getInitialProps() {
		const max = 90;
		const randomNumber = Math.floor(Math.random() * 7);
		const randomIndex = Math.floor(Math.random() * max);

		const initalWordResponse = await fetch(
			`https://api.datamuse.com/words?rel_jja=${
				colors[randomNumber]
			}&max=${max}`,
			{
				method: 'GET',
				headers: {
					Host: 'api.datamuse.com',
					Accept: '*/*'
				}
			}
		);
		const initalWordData = await initalWordResponse.json();
		const randomWord = initalWordData[randomIndex].word;

		const assocationResponse = await fetch(
			'https://twinword-word-associations-v1.p.mashape.com/associations/',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Accept: 'application/json',
					'X-Mashape-Key':
						'CYWBFQhyPJmshd94bPIfbDONvZ97p1WOBF9jsnt0IvwOTf5jvG'
				},
				body: `entry=${randomWord}`
			}
		);

		let randomNouns = [];
		const associationsData = await assocationResponse.json();
		randomNouns = [...associationsData.associations_array.slice(0, 2)];

		const nouns2 = await fetch(
			`https://api.datamuse.com/words?rel_jja=${randomWord}&max=10`,
			{
				method: 'GET',
				headers: {
					Host: 'api.datamuse.com',
					Accept: '*/*'
				}
			}
		);
		const nouns2Data = await nouns2.json();

		if (nouns2Data.length >= 4) {
			randomNouns = [
				...randomNouns,
				...nouns2Data.slice(0, 5).map(obj => obj.word)
			];
		} else {
			randomNouns = [
				...randomNouns,
				...associationsData.associations_array.slice(3, 8)
			];
		}

		console.log('nouns 2', nouns2Data.length);

		return { randomWord, randomNouns };
	}

	handleFetchNewWord = async word => {
		console.log('fetch new', word);
		const response = await fetch(
			'https://twinword-word-associations-v1.p.mashape.com/associations/',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Accept: 'application/json',
					'X-Mashape-Key':
						'CYWBFQhyPJmshd94bPIfbDONvZ97p1WOBF9jsnt0IvwOTf5jvG'
				},
				body: `entry=${word}`
			}
		);

		const data = await response.json();

		this.setState({
			data
		});

		return { data };
	};

	render() {
		console.log(this.props);
		return (
			<div>
				<h1>{this.props.randomWord}</h1>
				<div style={{ borderBottom: '2px solid coral' }} />
				{this.props.randomNouns.map(noun => {
					return <h2 key={noun}>{noun}</h2>;
				})}
			</div>
		);
	}
}

export default Home;
