import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CardTema from "../cardtema/CardTema"
import type Tema from "../../../models/Tema"
import { AuthContext } from "../../../contexts/AuthContext"
import { buscar } from "../../../services/Service"
import axios from "axios"
import { SyncLoader } from "react-spinners"

function ListaTemas() {
	// Objeto responsável redirecionar o usuário para uma outra rota
	const navigate = useNavigate()

	// Estado responsável por controlar o loader (animação de carregamento)
	const [isLoading, setIsLoading] = useState<boolean>(false)

	// Estado responsável por armazenar todos os temas persistidos no Backend (API)
	const [temas, setTemas] = useState<Tema[]>([])

	// Consumo da Context para obter os dados do usuário autenticado (estado usuario)
	// e a função handleLogout para efetuar logout caso o token seja inválido
	const { usuario, handleLogout } = useContext(AuthContext)
	const token = usuario.token

	// useEffect para monitorar o token
	useEffect(() => {
		if (token === "") {
			alert("Você precisa estar logado!")
			navigate("/")
		}
	}, [token])

	// useEffect responsável por executar a funcção buscarTemas
	useEffect(() => {
		buscarTemas()
	}, [temas.length])

	// Função responsável por buscar todos os temas no Backend (API)
	async function buscarTemas() {
		setIsLoading(true)

		try {
			await buscar(`/temas`, setTemas, {
				headers: { Authorization: token },
			})
		} catch (error) {
			if (axios.isAxiosError(error)) {
				alert(`Erro ao buscar os temas (${error.response?.status})`)
				if (error.response?.status === 401) {
					handleLogout()
				}
			}
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<>
			{isLoading && (
				<div className="flex justify-center w-full my-8">
					<SyncLoader color="#312e81" size={32} />
				</div>
			)}

			<div className="flex justify-center w-full px-4 my-4">
				<div className="container flex flex-col">
					{!isLoading && temas.length === 0 && (
						<span className="text-3xl text-center my-8">
							Nenhum Tema foi encontrado!
						</span>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{temas.map((tema) => (
							<CardTema key={tema.id} tema={tema} />
						))}
					</div>
				</div>
			</div>
		</>
	)
}
export default ListaTemas