import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const handleLogout = () => {
		
		dispatch({ type: "logout" });
		navigate("/");
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>

				<div className="ml-auto d-flex gap-2 align-items-center">
					{store.token ? (
						<>
							<span className="text-muted d-none d-sm-inline">
								{store.user?.email}
							</span>
							<Link to="/private">
								<button className="btn btn-outline-primary">Zona privada</button>
							</Link>
							<button className="btn btn-danger" onClick={handleLogout}>
								Cerrar sesión
							</button>
						</>
					) : (
						<>
							<Link to="/login">
								<button className="btn btn-outline-primary">Iniciar sesión</button>
							</Link>
							<Link to="/signup">
								<button className="btn btn-primary">Registrarse</button>
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};