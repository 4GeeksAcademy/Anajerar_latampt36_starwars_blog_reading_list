import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Navbar } from "../component/navbar";

export const Planet = props => {
    const { store, actions } = useContext(Context);
    const [ character, setCharacter ] = useState({'name':'',
                                        'description':'',})
    const [ properties, setProperties ] = useState({'diameter':'',
                                                    'gravity':'',
                                                    'population':'',
                                                    'terrain':'',
                                                    'climate':''})
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
            const response = await fetch(`https://www.swapi.tech/api/planets/${uid}`,{
                    headers:{}
                })
            const peopleData= await response.json()
            console.log(peopleData.result.properties.name);
            setCharacter({'name':peopleData.result.properties.name,
                        'description':peopleData.result.description
                        })
            setProperties({'diameter':peopleData.result.properties.diameter,
                            'gravity':peopleData.result.properties.gravity,
                            'population':peopleData.result.properties.population,
                            'terrain':peopleData.result.properties.terrain,
                            'climate':peopleData.result.properties.climate})
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
                                <img src={`https://starwars-visualguide.com/assets/img/planets/${params.theid}.jpg`} class="img-fluid rounded-start" alt="..."/>
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
                            <p clasName='justify-content-center'>Diameter</p>
                            <p>{properties.diameter}</p>
                        </div>
                        <div className='col-2'>
                            <p clasName='justify-content-center'>Gravity</p>
                            <p>{properties.gravity}</p>
                        </div>
                        <div className='col-2'>
                            <p clasName='justify-content-center'>Population</p>
                            <p>{properties.population}</p>
                        </div>
                        <div className='col-2'>
                            <p clasName='justify-content-center'>Terrain</p>
                            <p>{properties.terrain}</p>
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

Planet.propTypes = {
    match: PropTypes.object
};
