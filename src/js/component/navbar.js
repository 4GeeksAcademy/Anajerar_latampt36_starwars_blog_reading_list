import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

export const Navbar = ({ onUpdate }) => {
	const { store, actions } = useContext(Context);

	const favoriteList = () => {
		const render = (	store.favList.map((name,idx)=>{
								return (<li className='dropdown-item d-flex justify-content-between' key={idx}>
											<a><span className="fs-6">{name.name}</span></a>
											<button type="button" onClick={()=>onUpdate(name)}><i className="fs-6 fa-solid fa-trash"></i></button>
										</li>)}))
		return render
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
						aria-expanded="false">    Favorites     <span className="badge text-bg-secondary">{store.favsCount}</span></button>
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
