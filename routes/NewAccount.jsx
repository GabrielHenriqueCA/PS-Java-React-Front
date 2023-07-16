import React, { useState } from 'react';
import './NewAccount.css';
import bancoFetch from '../axios/config'; 

import { useNavigate } from 'react-router-dom';

export const NewAccount = () => {
  const navigate = useNavigate();
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [nomeResponsavelError, setNomeResponsavelError] = useState(false);

  const createAccount = async (e) => {
    e.preventDefault();

    if (!nomeResponsavel) {
      setNomeResponsavelError(true);
      return;
    }

    const account = {
      nomeResponsavel: nomeResponsavel
    };
  
    await bancoFetch.post('/contas', account);

    navigate('/');
  };

  return (
    <div className="new-account">
      <h2>Adicionar Nova Conta</h2>
      <form onSubmit={(e) => createAccount(e)}>
        <div className="form-control">
          <label htmlFor="nomeResponsavel">Nome Responsavel</label>
          <input
            type="text"
            name="nomeResponsavel" 
            id="nomeResponsavel" 
            placeholder="Digite seu Nome"
            value={nomeResponsavel}
            onChange={(e) => setNomeResponsavel(e.target.value)}
            className={nomeResponsavelError ? 'input-error' : ''}
          />
          {nomeResponsavelError && <p className="error-message">O campo é obrigatório</p>}
          <input type="submit" value="Criar Conta" className="btn" />
        </div>
      </form>
    </div>
  );
};
