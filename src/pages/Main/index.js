import { useState, useCallback, useEffect } from 'react';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
import { Container, Form, SubmitButton, List, DeleteButton } from './styles';
import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function Main() {
    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    // Buscar
    useEffect(() => {
        const repoStorage = localStorage.getItem('repos');
        if(repoStorage) {
            setRepositorios(JSON.parse(repoStorage));
        }
    }, [])

    // Salvar Alterações
    useEffect(() => {
        localStorage.setItem('repos', JSON.stringify(repositorios));
    }, [repositorios]);


    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        async function submit() {
            setLoading(true);
            setAlert(null);
            try {

                if(newRepo === '') {
                    throw new Error('Você precisa digitar o nome de algum repositório');
                }

                const response = await api.get(`repos/${newRepo}`);

                const hasRepo = repositorios.find((repositorio) => repositorio.name === newRepo);

                if(hasRepo) {
                    throw new Error('Repositório duplicado');
                }
                
                const data = {
                    name: response.data.full_name,
        
                }
        
                setRepositorios([...repositorios, data]);
                setNewRepo('');
            } catch(error) {
                setAlert(true);
                console.log("Ocorreu um erro ao buscar o repositório " + error);
            } finally {
                setLoading(false);
            }


        }

        submit();
    }, [newRepo, repositorios]);

    function handleInputChange(e) {
        setAlert(null);
        setNewRepo(e.target.value);
    }

    const handleDelete = useCallback((repositorio) => {
        const find = repositorios.filter(repo => repo.name !== repositorio);
        setRepositorios(find);
    }, [repositorios]);

    return(
        <div>
            <Container>
                <h1>
                    <FaGithub size={25}/>
                    Meus Repositórios
                </h1>

                <Form onSubmit={handleSubmit} error={alert}>
                    <input 
                        type="text" 
                        placeholder='Adicionar Repositórios' 
                        value={newRepo}
                        onChange={handleInputChange}
                    />
                    
                    <SubmitButton Loading={loading ? 1 : 0}>
                        {loading ? (
                            <FaSpinner color='#FFF' size={14}/>
                        ) : (
                            <FaPlus color="#FFF" size={14}/>
                        )}                      
                    </SubmitButton>

                </Form>

                <List>
                    {repositorios.map((repositorio) => (
                        <li key={repositorio.name}>
                            <span>
                                <DeleteButton onClick={() => handleDelete(repositorio.name)}>
                                    <FaTrash size={14}/>
                                </DeleteButton>
                                {repositorio.name}
                            </span>
                            <Link to={`/repositorio/${encodeURIComponent(repositorio.name)}`}>
                                <FaBars size={20}/>
                            </Link>
                        </li>
                    ))}
                </List>
                
            </Container>
        </div>
    );
}