import React, {Component} from 'react';

import { Query, Mutation } from 'react-apollo';

// queries
import { getDirectorsQuery, getMoviesQuery, newMovieMutation } from '../queries/queries';

class NewMovieForm extends Component {
	state = {
		title: '',
		description: '',
		year: null,
		directorId: ''
	};

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	render() {
		return (
			<Mutation
				mutation={newMovieMutation}
				onCompleted={() => {
					this.formRef.reset();
				}}
			>
				{ (addMovie, { loading, error }) => (

					<div className="container" data-state="New Movie">
						<div className="device" data-view="list">
							<form
								ref={el => {
									this.formRef = el;
								}}
								onSubmit={ e => {
									e.preventDefault();
									addMovie({
										variables: {
											title: this.state.title,
											description: this.state.description,
											year: parseInt(this.state.year, 10),
											directorId: this.state.directorId
										},
										refetchQueries: [{ query: getMoviesQuery }]
									});
								} }
							>
								<div>
									<input type="text" name="title" onChange={this.onChange} placeholder="Title"/>
								</div>
								<div>
									<textarea name="description" onChange={this.onChange} placeholder="Description"/>
								</div>
								<div>
									<input type="text" name="year" onChange={this.onChange} placeholder="Year"/>
								</div>
								<div>
									<select name="directorId" onChange={this.onChange} >
										<option disabled={true}>Choose Director</option>
										<Query query={getDirectorsQuery}>
											{({ loading, error, data }) => {
												if (loading) return <option disabled={true}>Loading...</option>;
												if (error) return <option disabled={true}>Error.</option>;

												return data.directors.map(({ id, name }) => (
													<option key={id} value={id}>
														{name}
													</option>
												))
											}}
										</Query>
									</select>
								</div>
								<div>
									<button type="submit">Submit</button>
								</div>
							</form>
						</div>
						{ loading && <div>Loading...</div>}
						{ error && <div>Error!</div>}
					</div>
				) }
			</Mutation>
		);
	}
}

export default NewMovieForm;
