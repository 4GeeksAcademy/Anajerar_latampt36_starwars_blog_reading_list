import React, { useState, useEffect, useContext, useRef } from "react";
import { Navigate,useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { Navbar } from "../component/navbar";
import rigoImage from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	//const [ imgIndx, setImgIndx ] = useState([])
	const [ people, setPeople ] = useState([]);
	const [ peopleDetails, setPeopleDetails] = useState([]);
	const [ planetProperties, setPlanetProperties ] = useState([]);
	const [ planetDetails, setPlanetDetails ] = useState([]);
	const [ nextPplPage, setNextPplPage ] = useState(null);
	const [ prevPplPage, setPrevPplPage ] = useState(null);
	const [ nextPltPage, setNextPltPage ] = useState(null);
	const [ prevPltPage, setPrevPltPage ] = useState(null);
	const [ blurPeople, setBlurPeople ] = useState(false);
	const { store, actions } = useContext(Context);
	const navigate = useNavigate()
	const divRef = useRef(null);
	//const [intervalId, setIntervalId] = useState();	

	const getPeopleHeader = async (url) => {

		fetch(url,{
				headers:{'content-type':'application/json'}
			})
			.then( response => {
				if (!response.ok) {
					throw new Error(response.statusText);
					}
					return response.json();	
				} )
			.then (resp => {
				setNextPplPage(resp.next)
				setPrevPplPage(resp.previous)
				const peopleArray = resp.results.map(single => {
					const findFav = store.favList.find((value)=> value.id==single.uid) // is favorite?
					const fav = findFav? true : false
					return {'uid':single.uid, 'name':single.name, 'gender':'*','hairColor':'*','eyeColor':'*','fav':fav}
				})
				//setPeople(peopleArray);
				getPeopleDetails(peopleArray)
				
			})
			.catch( console.log('An error occurred'))
			return

		} 
	

	const getPlanetHeader = async (url) => {
		
		try{
			const response = await fetch(url,{
				headers:{'content-type':'application/json'}
			})
			const planetData=await response.json();
			//console.log("this is the planet list:",planetData.results);
			setPlanetProperties(planetData.results);
			setNextPltPage(planetData.next);
			setPrevPltPage(planetData.previous);
			store.totalPeople = planetData.total_records;
			return

		} catch { return ({"msg":"error fetching"})}

	}

	const getPeopleDetails = async(people) => {
			const person = []
			const peopleArray = people.map((peopleItem, indx)=>{
				const url= `https://www.swapi.tech/api/people/${peopleItem.uid}`
				//console.log('the people', people)
				fetch(url,{
						headers:{}})
				.then (response => {
					if (!response.ok) {
						throw new Error(response.statusText);
						}
						return response.json();	
					})
				.then ( resp => {
					const details=resp;
					peopleItem.gender=details.result.properties.gender
					peopleItem.hairColor=details.result.properties.hair_color
					peopleItem.eyeColor=details.result.properties.eye_color
					person.push(peopleItem)
					//new Promise(resolve => setTimeout(resolve, ms));
					setTimeout( ()=> {
										setPeople(person);
										setBlurPeople(false)
									},2500)
					return
					})
				.catch (error => {console.log('There was an error with the details:'),error})
				return

				})	
			return }
	

	useEffect(()=>{
		getPeopleHeader('https://www.swapi.tech/api/people');
		getPlanetHeader('https://www.swapi.tech/api/planets');
		},[])

	const updatePeopleFavs = () => {
			const peopleArray = people.map(single => {
				const findFav = store.favList.find((value)=> value.id==single.uid) // is favorite?
				const fav = findFav? true : false
				single.fav=fav;
				return single
			})
			setPeople(peopleArray);

	}

	const nav =(name) => {
		store.favsCount--
		const nameRm = store.favNames.findIndex((value)=> value==name.name);
		store.favNames.splice(nameRm, 1);
		//const id = people.find((uid)=> uid.name==name );
		//console.log('name to be removed:',name, ' id:',id.uid, " Lis of id's:",store.favList);
		const idRm = store.favList.findIndex((value)=> value.name==name.name);
		console.log('this is the id position identified:',idRm)
		store.favList.splice(idRm, 1);
		console.log('store fav names:',store.favNames,'fav ids:',store.favList);
		updatePeopleFavs()
	}

	const planetCards = (planets) => {
		
		const render = planets.map((idx,keyIndex) => (
			<div className="card ms-2 bg-secondary" style={{flex: "0 0 300px" }} key={keyIndex}>
				<div className="m-2">
					<img src={(idx.uid=='1')? 'https://static.wikia.nocookie.net/esstarwars/images/b/b0/Tatooine_TPM.png/revision/latest?cb=20131214162357': `https://starwars-visualguide.com/assets/img/planets/${idx.uid}.jpg`} className="card-img-top" alt="..."/>
				</div>
				<div className="card-body">
					<h5 className="card-title">{idx.name}</h5>
					<p className="card-text">Population:</p>
					<a href="#" className="btn btn-primary">Learn more</a>
				</div>
			</div>))
		
		return render

	}

	const favorites = (id,fav,name) => {
		if (fav) {
			store.favsCount-- ;
			const idRm = store.favList.findIndex((value)=> value.id==id);
			const nameRm = store.favNames.findIndex((value)=> value==name);
			store.favList.splice(idRm, 1);
			store.favNames.splice(nameRm, 1);
		} else {
			store.favsCount++ ;
			store.favList.push({'id':id,'name':name});
			store.favNames.push(name)
		}
		updatePeopleFavs();
		console.log('fav names:', store.favList)
	}
	
	const charactersCards = (swpeople) => {
		//console.log("this people to render:",swpeople)
		const render = swpeople.map((idx,keyIndex) => (
			<div className="card ms-2 bg-dark" style={{flex: "0 0 300px" }} key={keyIndex} >
				<div className="m-2">
					<img src={`https://starwars-visualguide.com/assets/img/characters/${idx.uid}.jpg`} className="card-img-top" alt="..."/>
				</div>
				<div className="card-body">
					<h5 className="card-title text-light">{idx.name}</h5>
					<p className="card-text text-light">Genre:{idx.gender}</p>
					<p className="card-text text-light">Hair Color:{idx.hairColor}</p>
					<p className="card-text text-light">Eye Color:{idx.eyeColor}</p>
					<div className='d-flex justify-content-between'>
						<button onClick={() => {navigate(`/single/${idx.uid}`)}} className="btn btn-primary">Learn more</button>
						<button type="button" className={idx.fav? 'btn btn-danger':'btn btn-secondary'}
							onClick={() => {favorites(idx.uid,idx.fav,idx.name)}}><i class="fa-regular fa-heart"></i></button>
							
					</div>
				</div>
			</div>))
		
		return render

	}
	
	const moveLeft = (nextpage) =>{
		console.log('moving',divRef.current);
		setBlurPeople(true)
		getPeopleHeader(nextpage)
		if (divRef.current) {
            divRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }

	} 

	return (
		<>
			<Navbar onUpdate={nav}/>
			<div className="text-start">
				
				<h3>Characters</h3>
					<div className="d-flex" style={{overflowX: 'auto', width:'98%',
											filter: blurPeople? 'grayscale(100%)':'none'}} ref={divRef}>
						{prevPplPage?<div>
										<button type="button" className="btn btn-primary" 
										onClick={()=> getPeopleHeader(prevPplPage)}>{'<<'}</button>
									</div> :null}
						{charactersCards(people)}
						{nextPplPage?<div>
										<button type="button" className="btn btn-primary" 
										onClick={()=> moveLeft(nextPplPage)}>{'>>'}</button>
									</div> :null}
					</div>
				<h3>Planets</h3>
					<div className="d-flex" style={{overflowX: 'auto', width:'98%'}}>
						{prevPltPage?<div>
										<button type="button" className="btn btn-primary" 
										onClick={()=> getPlanetHeader(prevPltPage)}>{'<<'}</button>
									</div> :null}
						{planetCards(planetProperties)}
						{nextPltPage?<div>
										<button type="button" className="btn btn-primary" 
										onClick={()=> getPlanetHeader(nextPltPage)}>{'>>'}</button>
									</div> :null}
					</div>
			</div>
		</>
)};
