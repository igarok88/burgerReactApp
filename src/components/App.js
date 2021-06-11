import React from "react";
import Header from "./Header";
import Order from "./Order";
import MenuAdmin from "./MenuAdmin";
import sampleBurgers from "../sample-burgers";
import Burger from "./Burger";
import base from "../base";
import PropTypes from "prop-types";
import SignIn from "./Auth/SignIn";
import firebase from "firebase/app";

class App extends React.Component {
	static propTypes = {
		match: PropTypes.object,
	};

	state = {
		burgers: {},
		order: {},
	};

	componentDidMount() {
		const { params } = this.props.match;

		const localStorageRef = localStorage.getItem(params.restaurantId);
		if (localStorageRef) {
			this.setState({ order: JSON.parse(localStorageRef) });
		}
		// console.log("localStorageRef", localStorageRef);
		this.ref = base.syncState(`${params.restaurantId}/burgers`, {
			context: this,
			state: "burgers",
		});
	}

	componentDidUpdate() {
		const { params } = this.props.match;

		localStorage.setItem(params.restaurantId, JSON.stringify(this.state.order));
	}

	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	addBurger = (burger) => {
		console.log("addBurger", burger);
		//Добавляем бургер:
		//1. Делаем копию объекта state
		const burgers = { ...this.state.burgers };
		//2. Добавляем новый burger в объект burgers
		burgers[`burger${Date.now()}`] = burger; //Date.now используем для создания уникалькой метки бургеру
		//3. Записываем наш новый объект burgers в объект state
		this.setState({ burgers: burgers });
	};

	updatedBurger = (key, updatedBurger) => {
		//1. Делаем копию объекта state
		const burgers = { ...this.state.burgers };
		//2. Обновляем нужный burger
		burgers[key] = updatedBurger;
		//3. Записываем наш новый объект burgers в объект state
		this.setState({ burgers: burgers });
	};

	deleteBurger = (key) => {
		//1. Делаем копию объекта state
		const burgers = { ...this.state.burgers };
		//2. Удаляем burger
		burgers[key] = null;
		//3. Записываем наш новый объект burgers в объект state
		this.setState({ burgers: burgers });
	};

	loadSampleBurgers = () => {
		this.setState({ burgers: sampleBurgers });
	};

	addToOrder = (key) => {
		//1. делаем копию объекта state
		const order = { ...this.state.order };
		//2. в объект order добавляем св-во key (добавляем ключ к заказу со значением 1, или обновить текущее значение)
		order[key] = order[key] + 1 || 1;
		//3. записываем обновленное значение order в объект state
		this.setState({ order: order });
	};

	deleteFromOrder = (key) => {
		//1. делаем копию объекта state
		const order = { ...this.state.order };
		//2. Удаляем burger
		delete order[key];
		//3. записываем обновленное значение order в объект state
		this.setState({ order: order });
	};

	handleLogout = async () => {
		await firebase.auth().signOut();
		window.location.reload();
	};

	render() {
		return (
			<SignIn>
				<div className="burger-paradise">
					<div className="menu">
						<Header title="Very Hot Burger" />
						<ul className="burgers">
							{Object.keys(this.state.burgers).map((key) => {
								return (
									<Burger
										addToOrder={this.addToOrder}
										key={key}
										index={key}
										details={this.state.burgers[key]}
									/>
								);
							})}
						</ul>
					</div>
					<Order
						deleteFromOrder={this.deleteFromOrder}
						burgers={this.state.burgers}
						order={this.state.order}
					/>
					<MenuAdmin
						handleLogout={this.handleLogout}
						deleteBurger={this.deleteBurger}
						updatedBurger={this.updatedBurger}
						burgers={this.state.burgers}
						addBurger={this.addBurger}
						loadSampleBurgers={this.loadSampleBurgers}
					/>
				</div>
			</SignIn>
		);
	}
}

export default App;
