import React from 'react';
import fetch from 'isomorphic-unfetch';

class Home extends React.Component {
    state = {};
    static async getInitialProps() {
        const response = await fetch(
            'https://twinword-word-associations-v1.p.mashape.com/associations/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                    'X-Mashape-Key': 'CYWBFQhyPJmshd94bPIfbDONvZ97p1WOBF9jsnt0IvwOTf5jvG'
                },
                body: 'entry=dog'
            }
        );

        const data = await response.json();

        return {data};
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
                    'X-Mashape-Key': 'CYWBFQhyPJmshd94bPIfbDONvZ97p1WOBF9jsnt0IvwOTf5jvG'
                },
                body: `entry=${word}`
            }
        );

        const data = await response.json();

        this.setState({
            data
        });

        return {data};
    };

    render() {
        const entry = this.state.data ? this.state.data.entry : this.props.data.entry;
        const associations_array = this.state.data
            ? this.state.data.associations_array
            : this.props.data.associations_array;

        return (
            <div>
                <h1 onClick={() => this.handleFetchNewWord(associations_array[0])}>
                    {entry}
                </h1>
                <div>
                    {associations_array.slice(0, 6).map(word => {
                        return <div key={word}>{word}</div>;
                    })}
                </div>
            </div>
        );
    }
}

export default Home;
