import React, { useState, useEffect } from 'react';
import axios from 'axios';
import bancoFetch from '../axios/config';
import { Link } from 'react-router-dom';

import './Home.css';

export const Home = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAccounts = async () => {
    try {
      const response = await bancoFetch.get("/contas/obter");
      const data = response.data.content;
      setAccounts(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  return (
    <div className='home'>
      <h1>Contas Existentes</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        accounts.map((account) => (
          <div className="accounts" key={account.id}>
            <h2>Numero da Conta: {account.id}</h2>
            <h2>Responsavel: {account.nomeResponsavel}</h2>
            <Link to={`/account/${account.id}`} className='btn'>Ver mais</Link>
          </div>
        ))
      )}
    </div>
  );
};