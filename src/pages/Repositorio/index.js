import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container } from "./styles";
import api from "../../services/api";
import { Owner, Loading, BackButton, IssuesList, PageActions, IssuesActions } from "./styles";
import { FaArrowLeft } from 'react-icons/fa';

export default function Repositorio() {
    const [repo, setRepo] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [type, setType] = useState('open');
    const { repositorio } = useParams();
    const repositoryName = decodeURIComponent(repositorio);

    useEffect(() => {
        async function loadRepo() {

           const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${repositoryName}`),
                api.get(`/repos/${repositoryName}/issues`, {
                    params: {
                        state: type,
                        per_page: 5
                    }
                })
            ]);
            setRepo(repositorioData.data);
            setIssues(issuesData.data);
            setLoading(false);
        }

        loadRepo();
    }, [repositorio]);

    useEffect(() => {

        async function loadIssue() {
            const nomeRepo = decodeURIComponent(repositorio);

            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params: {
                    state: type,
                    page,
                    per_page: '5', 
                }
            });

            setIssues(response.data);
            
        }

        loadIssue();

    }, [page, type]);

    useEffect(() => {
        async function loadType() {
            const nomeRepo = decodeURIComponent(repositorio);

            const response = api.get(`/repos/${nomeRepo}/issues`, {
                params: {
                    state: type,
                    page,
                    per_page: 5,
                }
            });
            
            console.log(response)
        }

        loadType();

    }, [type]);

    function handlePage(action) {
        setPage(action === 'back' ? page - 1 : page + 1)
    }

    function handleType(type) {
        if(type === 'all'){
            setType('all');
        }

        if(type === 'open') {
            setType('open');
        }

        if(type === 'closed') {
            setType('closed');
        }
    }

    if(loading) {
        return(
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        );
    }

    return(
        <div>
            <Container>
                <BackButton to="/">
                        <FaArrowLeft size={30} color="#000"/>
                </BackButton>
                <Owner>
                    <img 
                    src={repo.owner.avatar_url} 
                    alt={repo.owner.login} 
                    />
                    <h1>{repo.name}</h1>
                    <p>{repo.description}</p>
                </Owner>

                <IssuesActions>
                    <button type="button" onClick={() => handleType('all')}>Todas</button>
                    <button type="button" onClick={() => handleType('open')}>Abertas</button>
                    <button type="button" onClick={() => handleType('closed')}>Fechadas</button>
                </IssuesActions>

                <IssuesList>
                    {issues.map((issue) => (
                        <li key={String(issue.id)}>
                            <img src={issue.user.avatar_url} alt={issue.user.login} />

                            <div>
                                <strong>
                                    <a href={issue.html_url}>{issue.title}</a>

                                    {issue.labels.map((label) => (
                                        <span key={String(label.id)}>{label.name}</span>
                                    ))}
                                </strong>
                                <p>{issue.user.login}</p>
                            </div>

                        </li>
                    ))}
                </IssuesList>

                <PageActions>
                    <button type="button" onClick={() => handlePage('back')} disabled={page < 2}>Voltar</button>
                    <button type="button" onClick={() => handlePage('next')}>Próxima</button>
                </PageActions>

            </Container>
            
        </div>
    );
}