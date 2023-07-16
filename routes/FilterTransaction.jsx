import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import bancoFetch from "../axios/config";

import "./FilterTransaction.css";

export const FilterTransaction = () => {
  const columns = [
    {
      name: 'Dados',
      selector: row => row.dataTransferencia,
      sortable: true,
      format: row => new Date(row.dataTransferencia).toLocaleDateString('pt-BR')
    },
    {
      name: 'Valencia',
      cell: row => (
        <span className={row.tipo === 'SAQUE' ? 'negative-value' : ''}>
          {row.tipo === 'SAQUE' ? 'R$ -' : 'R$'} {row.valor}
        </span>
      ),
      sortable: true
    },
    {
      name: 'Tipo',
      selector: row => row.tipo,
      sortable: true
    },
    {
      name: 'Operador da Transacao',
      selector: row => row.nomeOperadorTransacao,
      sortable: true,
    },
    {
      name: 'Destinatario',
      selector: row => {
        if (row.tipo === "TRANSFERENCIA") {
          return row.conta.nomeResponsavel;
        } else {
          return "";
        }
      },
      sortable: true,
    }
  ];

  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [saldoPorPeriodo, setSaldoPorPeriodo] = useState(0);
  const [saldoPorOperador, setSaldoPorOperador] = useState(0);

  const fetchTransactions = async (page) => {
    try {
      const response = await bancoFetch.get("/transferencias", {
        params: {
          page: page
        }
      });
      const { content, totalPages } = response.data;
      setRecords(content);
      setTotalPages(totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage]);

  const handleFilter = () => {
    fetchTransactions(0);
  };

  const handlePageChange = page => {
    setCurrentPage(page - 1);
  };

  const applyFilters = (data) => {
    let filteredData = data;

    if (startDate && endDate) {
      filteredData = filteredData.filter(row => {
        const rowDataTransferencia = new Date(row.dataTransferencia);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return rowDataTransferencia >= start && rowDataTransferencia <= end;
      });
    } else if (startDate) {
      filteredData = filteredData.filter(row => {
        const rowDataTransferencia = new Date(row.dataTransferencia);
        const start = new Date(startDate);
        return rowDataTransferencia >= start;
      });
    } else if (endDate) {
      filteredData = filteredData.filter(row => {
        const rowDataTransferencia = new Date(row.dataTransferencia);
        const end = new Date(endDate);
        return rowDataTransferencia <= end;
      });
    }

    if (operatorName) {
      filteredData = filteredData.filter(row =>
        row.nomeOperadorTransacao.toLowerCase().includes(operatorName.toLowerCase())
      );
    }

    return filteredData;
  };

  const filteredRecords = applyFilters(records);

  const calcularSaldos = () => {
    let saldoTotal = 0;
    let saldoPorPeriodo = 0;
    let saldoPorOperador = 0;
  
    filteredRecords.forEach(transaction => {
      if (transaction.tipo === "TRANSFERENCIA") {
        saldoTotal += transaction.valor;
        
        if (startDate && endDate) {
          const rowDataTransferencia = new Date(transaction.dataTransferencia);
          const start = new Date(startDate);
          const end = new Date(endDate);
          if (rowDataTransferencia >= start && rowDataTransferencia <= end) {
            saldoPorPeriodo += transaction.valor;
          }
        }
      } else if (transaction.tipo === "SAQUE") {
        saldoTotal -= transaction.valor;
        if (transaction.nomeOperadorTransacao === transaction.nome) {
          saldoPorOperador -= transaction.valor;
        }
      } else {
        saldoTotal += transaction.valor;
        if (transaction.nomeOperadorTransacao === transaction.nome) {
          saldoPorOperador += transaction.valor;
        }
      }
    });

    setSaldoTotal(Math.max(0, saldoTotal));
    setSaldoPorPeriodo(Math.max(0, saldoPorPeriodo));
    setSaldoPorOperador(Math.max(0, saldoPorOperador));
  };

  useEffect(() => {
    calcularSaldos();
  }, [filteredRecords]);

  return (
    <div className="filter-transaction-container">
      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        <input
          type="date"
          placeholder="Data Início"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="date"
          placeholder="Data Final"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="Nome do Operador"
          value={operatorName}
          onChange={(e) => setOperatorName(e.target.value)}
          style={{ marginRight: '10px' }}
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredRecords}
        className="rdt_Table"
        pagination
        paginationTotalRows={totalPages * 10}
        paginationPerPage={10}
        paginationComponentOptions={{
          rowsPerPageText: 'Registros por página:',
          rangeSeparatorText: 'de',
          noRowsPerPage: false,
          withFirstAndLast: true,
          alwaysShowAllBtns: true,
          disablePageNumInput: true,
          disablePrevBtn: currentPage === 0,
          disableNextBtn: currentPage === totalPages - 1,
          onPageChange: handlePageChange
        }}
      />
      <div>
        Saldo total: R$ {saldoTotal.toFixed(2)}
      </div>
      {startDate || endDate || operatorName ? (
        <>
          {startDate && endDate && (
            <div>Saldo por período: {saldoTotal.toFixed(2)}</div>
          )}
        </>
      ) : null}
    </div>
  );
};
