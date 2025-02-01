import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Navbar = () => {
	const { store, actions } = useContext(Context);

	const favoriteList = () => {
		const render = (	store.favNames.map((name)=>{
								return (<li className='dropdown-item d-flex justify-content-between'>
											<a><span className="fs-6">{name}</span></a>
											<button type="button" onClick={()=>{removeFav(name)}}><i class="fs-6 fa-solid fa-trash"></i></button>
										</li>)}))
		return render
	}

	const removeFav =(name) => {
			console.log('name to be removed:',name)
			store.favsCount--
			const nameRm = store.favNames.findIndex((value)=> value==name);
			store.favNames.splice(nameRm, 1);
	}

	return (
		<nav className="navbar navbar-light bg-light mb-3">
			<div className="row justify-content-between">
				<div className="col-2">
					<Link to="/">
						<img src="https://cdn.worldvectorlogo.com/logos/star-wars.svg" className="ms-3" style={{width:'30%'}}></img>
					</Link>
				</div>
				<div className="col-4 ml-auto dropdown">
						<button className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" 
						aria-expanded="false">    Favorites     <span class="badge text-bg-secondary">{store.favsCount}</span></button>
						<ul className="dropdown-menu">
							{(store.favList.length>0)? 
												favoriteList(): 
												<li><a className='dropdown-item'>Empty</a></li>}
						</ul>
				</div>
			</div>
		</nav>
	);
};
