import { TableView } from '@table'
import { Customers } from 'types'
import './App.css'
import { customers } from './customersData.json'

function App() {
  return (
    <div className="App">
        <TableView customers={customers as Customers} />
    </div>
  )
}

export default App
