import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Navbar } from "../component/navbar";

export const Planet = props => {
    const { store, actions } = useContext(Context);
    const [ planet, setPlanet ] = useState({'name':'',
                                        'description':'',})
    const [ properties, setProperties ] = useState({'diameter':'',
                                                    'gravity':'',
                                                    'population':'',
                                                    'terrain':'',
                                                    'climate':''})
    const params = useParams();
    
    const getDescription = async(title) => {
        const descResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,{cache: "no-store",
            headers:{'content-type':'application/json'}})
        if (descResponse.status==404) { return }
        const description = await descResponse.json();
        setPlanet({'name':title,'description':description.extract})
    }

    useEffect(()=>{
        const getPlanet = async(uid) =>{
            const response = await fetch(`https://www.swapi.tech/api/planets/${uid}`,{
                    headers:{}
                })
            const planetData= await response.json()
            setPlanet({'name':planetData.result.properties.name,
                        'description':planetData.result.description
                        })
            setProperties({'diameter':planetData.result.properties.diameter,
                            'gravity':planetData.result.properties.gravity,
                            'population':planetData.result.properties.population,
                            'terrain':planetData.result.properties.terrain,
                            'climate':planetData.result.properties.climate})
            getDescription(planetData.result.properties.name)

        }
        getPlanet(params.theid)
    },[])
    
    return (
        <>
                <Navbar />
                <div className="jumbotron ms-5">
                    <div className="card d-flex justify-content-center" style={{'max-width': "80%"}}>
                        <div className="row g-0">
                            <div className="col-md-3 m-3">
                                <img src={`https://starwars-visualguide.com/assets/img/planets/${params.theid}.jpg`} className="img-fluid rounded-start" alt="..."/>
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">{planet.name}</h5>
                                    <p className="card-text">{planet.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-2'>
                            <p clasName='jusrify-content-center'>Name</p>
                            <p>{planet.name}</p>
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
