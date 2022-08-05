import './App.css'
import React from 'react'
import io from 'socket.io-client'
import { useEffect, useState } from 'react'

const socket = io('http://io.nvdise.space', {
    timeout: 2000,
    secure: true,
    reconnection: false,
    transports: ['websocket'],
    // transports: ['polling'],
})

class MarketSymbolInfo {
    constructor() {
        this.trade = {}
        this.ohlcv = {
            '1DAY': {},
            '12HRS': {},
            '1HRS': {},
        }
    }
}

let structureData = {}
window.structureData = structureData

function App() {

    const [dataTable, setDataTable] = useState([]);
    const [listSymbolId, setListSymbolId] = useState([]);

    socket.on('market-data', (msg) => {
        if (!structureData[msg.symbol_id]) {
            structureData[msg.symbol_id] = new MarketSymbolInfo()
        }
        if (msg.type === 'trade') {
            structureData[msg.symbol_id]['trade'] = msg
        }
        if (msg.type === 'ohlcv') {
            if (msg.period_id === '1DAY') {
                structureData[msg.symbol_id]['ohlcv']['1DAY'] = msg
            }
            if (msg.period_id === '12HRS') {
                structureData[msg.symbol_id]['ohlcv']['12HRS'] = msg
            }
            if (msg.period_id === '1HRS') {
                structureData[msg.symbol_id]['ohlcv']['1HRS'] = msg
            }
        }
        // updateData()
    })

    
    useEffect(() => {
      socket.on('connect', () => {
        console.log(socket.id)
      })

      const interval = setInterval(() => {
        updateData()
      }, 5000);
      return()=>{
        clearInterval(interval);
        }
    }, [])
    const updateData=()=>{

      // console.log(structureData)
      const listSymbol = Object.keys(structureData)
      // console.log(listSymbol)
      setListSymbolId(listSymbol)
      const dataTb = listSymbol.map((key) => {
        return { ...structureData[key] }
      })
      setDataTable(dataTb)
      // console.log(structureData, dataTb)
    }


    return (
        <div className='App'>
            <h1 id='ID'>aaaaa</h1>
            <table>
              <tr>
                <td>Symbol</td>
                <td>Price</td>
                <td>Volume</td>
              </tr>
                {dataTable.map((item, i) => {
                    return (
                        <tr>
                            <td>{item.trade.symbol_id}</td>
                            <td>{item.trade.price}</td>
                            <td>{item.trade.size}</td>
                        </tr>
                    )
                })}
            </table>
        </div>
    )
}

export default App