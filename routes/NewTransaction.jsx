import React, { useState } from 'react';
import bancoFetch from '../axios/config';
import { useNavigate } from 'react-router-dom';
import './NewTransaction.css'; 

export const NewTransaction = () => {
  const navigate = useNavigate();

  const [tipoTransacao, setTipoTransacao] = useState('');
  const [valor, setValor] = useState('');
  const [contaOrigem, setContaOrigem] = useState('');
  const [contaDestino, setContaDestino] = useState('');

  const createTransaction = async (e) => {
    e.preventDefault();

    const transaction = {
      valor,
    };

    let apiEndpoint = '';
    let requestParams = {};

    switch (tipoTransacao) {
      case 'transferencia':
        apiEndpoint = 'transferencias/realizar-transferencia';
        requestParams = {
          numeroContaOrigem: contaOrigem,
          numeroContaDestino: contaDestino,
        };
        break;
      case 'saque':
        apiEndpoint = 'transferencias/realizar-saque';
        requestParams = {
          numeroContaDestino: contaOrigem,
        };
        break;
      case 'deposito':
        apiEndpoint = 'transferencias/realizar-deposito';
        requestParams = {
          numeroContaDestino: contaOrigem,
        };
        break;
      default:
        // Se o tipo de transação não for válido, retorne ou exiba uma mensagem de erro
        return;
    }

    await bancoFetch.post(apiEndpoint, transaction, { params: requestParams });

    navigate('/');
  };

  return (
    <div className="new-transaction">
      <h2>Adicionar Nova Transação</h2>
      <form onSubmit={createTransaction}>
        <div className="form-control">
          <label htmlFor="tipoTransacao">Tipo de Transação</label>
          <select
            name="tipoTransacao"
            id="tipoTransacao"
            value={tipoTransacao}
            onChange={(e) => setTipoTransacao(e.target.value)}
          >
            <option value="">Selecione o tipo de transação</option>
            <option value="transferencia">Transferência</option>
            <option value="saque">Saque</option>
            <option value="deposito">Depósito</option>
          </select>
        </div>

        {tipoTransacao === 'transferencia' && (
          <>
            <div className="form-control">
              <label htmlFor="contaOrigem">Conta de Origem</label>
              <input
                type="text"
                name="contaOrigem"
                id="contaOrigem"
                placeholder="Número da conta de origem"
                value={contaOrigem}
                onChange={(e) => setContaOrigem(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label htmlFor="contaDestino">Conta de Destino</label>
              <input
                type="text"
                name="contaDestino"
                id="contaDestino"
                placeholder="Número da conta de destino"
                value={contaDestino}
                onChange={(e) => setContaDestino(e.target.value)}
              />
            </div>
          </>
        )}

        {tipoTransacao === 'saque' && (
          <div className="form-control">
            <label htmlFor="contaOrigem">Conta de Origem</label>
            <input
              type="text"
              name="contaOrigem"
              id="contaOrigem"
              placeholder="Número da conta de origem"
              value={contaOrigem}
              onChange={(e) => setContaOrigem(e.target.value)}
            />
          </div>
        )}

        {tipoTransacao === 'deposito' && (
          <div className="form-control">
            <label htmlFor="contaOrigem">Conta de Origem</label>
            <input
              type="text"
              name="contaOrigem"
              id="contaOrigem"
              placeholder="Número da conta de origem"
              value={contaOrigem}
              onChange={(e) => setContaOrigem(e.target.value)}
            />
          </div>
        )}

        <div className="form-control">
          <label htmlFor="valor">Valor</label>
          <input
            type="number"
            name="valor"
            id="valor"
            placeholder="Digite o valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </div>

        <input type="submit" value="Criar Transacao" className="btn" />
      </form>
    </div>
  );
};