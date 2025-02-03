import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Navbar } from "../component/navbar";

export const Single = props => {
	const { store, actions } = useContext(Context);
	const [ character, setCharacter ] = useState({'name':'',
										'description':'',})
	const [ properties, setProperties ] = useState({'birth_year':'',
													'gender':'',
													'height':'',
													'skin_color':'',
													'eye_color':''})
	const params = useParams();
	
	const getDescription = async(title) => {
		console.log('getting wikipedia description:',title)
		const descResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,{cache: "no-store",
			headers:{'content-type':'application/json'}})
		if (descResponse.status==404) { return }
		const description = await descResponse.json();
		console.log("the guy description:",description.extract)
		setCharacter({'name':title,'description':description.extract})
	}

	useEffect(()=>{
		const getPeople = async(uid) =>{
			console.log('getting people id:',uid)
			const response = await fetch(`https://www.swapi.tech/api/people/${uid}`,{
					headers:{}
				})
			const peopleData= await response.json()
			console.log(peopleData.result.properties.name);
			setCharacter({'name':peopleData.result.properties.name,
						'description':peopleData.result.description
						})
			setProperties({'birthYear':peopleData.result.properties.birth_year,
							'gender':peopleData.result.properties.gender,
							'height':peopleData.result.properties.height,
							'skinColor':peopleData.result.properties.skin_color,
							'eyeColor':peopleData.result.properties.eye_color})
			getDescription(peopleData.result.properties.name)

		}
		getPeople(params.theid)
	},[])
	
	return (
		<>
				<Navbar />
				<div className="jumbotron ms-5">
					<div class="card d-flex justify-content-center" style={{'max-width': "80%"}}>
						<div class="row g-0">
							<div class="col-md-3 m-3">
								<img src={`https://starwars-visualguide.com/assets/img/characters/${params.theid}.jpg`} class="img-fluid rounded-start" alt="..."/>
							</div>
							<div class="col-md-8">
								<div class="card-body">
									<h5 class="card-title">{character.name}</h5>
									<p class="card-text">{character.description}</p>
								</div>
							</div>
						</div>
					</div>
					<div className='row'>
						<div className='col-2'>
							<p clasName='jusrify-content-center'>Name</p>
							<p>{character.name}</p>
						</div>
						<div className='col-2'>
							<p clasName='justify-content-center'>Birth Year</p>
							<p>{properties.birthYear}</p>
						</div>
						<div className='col-2'>
							<p clasName='justify-content-center'>Height</p>
							<p>{properties.height}</p>
						</div>
						<div className='col-2'>
							<p clasName='justify-content-center'>Skin Color</p>
							<p>{properties.skinColor}</p>
						</div>
						<div className='col-2'>
							<p clasName='justify-content-center'>Eyes Color</p>
							<p>{properties.eyeColor}</p>
						</div>
					</div>

					<Link to="/">
						<span className="btn btn-primary btn-lg" href="#" role="button">
							Back home
						</span>
					</Link>
				</div>
		</>
	
	)
};

Single.propTypes = {
	match: PropTypes.object
};
