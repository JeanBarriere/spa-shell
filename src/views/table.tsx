import { determineNumber } from "!numberHelpers";
import { ChangeEvent, useMemo, useState } from "react";
import { Customer, Customers, CustomerStatus } from "types";

interface TableViewProps {
  customers: Customers
}

interface TableRowProps {
  customer: Customer
  onDelete: (customerId: number) => void
}

interface CurrencyProps {
  currencyValue: string
}

function Currency ({ currencyValue }: CurrencyProps) {
  const value = parseFloat(currencyValue).toFixed(2)
  return (
    <div className="flex flex-col items-end justify-end">
      <p className="text-gray-pimary text-sm">{ value }</p>
      <p className="text-gray-secondary text-xs">INR</p>
    </div>
  )
}

function ColoredCurrency ({ currencyValue }: CurrencyProps) {
  const floatValue = parseFloat(currencyValue)
  const stringValue = floatValue.toFixed(2)
  const colorClass = determineNumber(() => 'text-green-positive', () => 'text-red-negative', () => 'text-gray-secondary')(floatValue)

  return (
    <div className="flex flex-col items-end justify-end">
      <p className={`${colorClass} text-sm`}>{ stringValue }</p>
      <p className="text-gray-secondary text-xs">INR</p>
    </div>
  )
}

interface StatusPillProps {
  status: CustomerStatus
}

function StatusPill ({ status }: StatusPillProps) {
  switch (status) {
    case 'active':
      return (<div className="bg-primary flex justify-center rounded-full p-1 text-white"><span>ACTIVE</span></div>)
    case 'inactive':
      return (<div className="bg-white flex justify-center rounded-full p-1 text-gray-secondary border border-gray-secondary"><span>INACTIVE</span></div>)
    default:
      // TODO: maybe throw?
      return (<></>)
  }
}


function TableRow ({ customer, onDelete }: TableRowProps) {
  return (
    <tr>
      <td></td>
      <td>
        <span>
          { `${customer.firstName} ${customer.lastName}`}
        </span>
        <span>
          { `${customer.id}`}
        </span>
      </td>
      <td><p>{ customer.description }</p></td>
      <td><Currency currencyValue={customer.rate}/></td>
      <td><ColoredCurrency currencyValue={customer.balance}/></td>
      <td><Currency currencyValue={customer.deposit}/></td>
      <td><StatusPill status={customer.status} /></td>
      <td><button className="cursor-pointer p-1" onClick={() => onDelete(customer.id)}><img src="./src/components/atoms/icons/Delete.png" /></button></td>
    </tr>
  )
}

enum SortState {
  UNDEFINED = 0,
  DESC = 1,
  ASC = -1
}

const nextSortingState = (sortState: SortState): SortState => {
  switch (sortState) {
    case SortState.UNDEFINED:
      return SortState.DESC
    case SortState.DESC:
      return SortState.ASC
    case SortState.ASC:
      return SortState.UNDEFINED
    default:
      throw new Error('SortState has an unsafe state')
  }
}

export function TableView ({ customers }: TableViewProps) {
  const filteringFunction = (customer: Customer) => {
    const sanitizedSearchInput = searchInput.trim().toLowerCase()

    const matchingName = `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(sanitizedSearchInput)
    const matchingDescription = customer.description.toLowerCase().includes(sanitizedSearchInput)

    return matchingName || matchingDescription
  }


  const sortFunction = (customerA: Customer, customerB: Customer) => {
    const statusSort = customerA.status.localeCompare(customerB.status) * statusSortState * 2
    const nameSort = `${customerB.firstName} ${customerB.lastName}`.localeCompare(`${customerA.firstName} ${customerA.lastName}`) * nameSortState

    return nameSort + statusSort
  }

  const perPage = 10

  const [searchInput, setSearchInput] = useState('')
  const [mutableCustomers, updateCustomers] = useState(customers)
  const [currentPage, setPage] = useState(1)
  const [nameSortState, setNameSortState] = useState(SortState.UNDEFINED)
  const [statusSortState, setStatusSortState] = useState(SortState.UNDEFINED)


  const onNameSortChange = () => {
    setNameSortState(nextSortingState(nameSortState))
  }

  const onStatusSortChange = () => {
    setStatusSortState(nextSortingState(statusSortState))
  }

  const onDelete = (id: number) => {
    updateCustomers(mutableCustomers.filter(customer => customer.id !== id))
  }

  const filteredCustomers = useMemo(() => 
    mutableCustomers
      // filter with search input
      .filter(filteringFunction)
      .sort(sortFunction),
    [searchInput, nameSortState, statusSortState, mutableCustomers]
  )

  // slice customers with pagination
  const pagedCustomers = useMemo(() =>
    filteredCustomers
      .slice((currentPage - 1) * perPage, currentPage * perPage),
    [currentPage, perPage, filteredCustomers, mutableCustomers]
  )
  const maxPages = useMemo(() => Math.floor(mutableCustomers.length / perPage) + (mutableCustomers.length % perPage === 0 ? 0 : 1), [mutableCustomers, perPage])

  const onInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (currentPage > 1) {
      setPage(1) // go back to page 1
    }
    setSearchInput(evt.target.value)
  }

  const goToPrevPage = () => {
    // go to the previous page
    console.log(maxPages)
    setPage(Math.max(currentPage - 1, 1))
  }
  const goToNextPage = () => {
    // go to the next page
    setPage(Math.min(currentPage + 1, maxPages))
  }

  return (
    <table>
      <thead className="bg-gray-table-head">
        <tr>
          <th colSpan="3">
            <input value={searchInput} onChange={onInputChange} />
          </th>
        </tr>
        <tr>
          <th>Select all</th>
          <th>Name <button onClick={onNameSortChange}>Sort {nameSortState}</button></th>
          <th>Description</th>
          <th>Rate</th>
          <th>Balance</th>
          <th>Deposit</th>
          <th>Status <button onClick={onStatusSortChange}>Sort {statusSortState}</button></th>
          <th>...</th>
        </tr>
      </thead>
      <tbody>
        {pagedCustomers.map(customer => <TableRow key={customer.id} onDelete={onDelete} customer={customer} />)}
      </tbody>
      <tfoot className="w-full">
        <tr>
          <td>
            <div className="flex flex-row flex-grow justify-between w-full">
              <div>active customers ??/{filteredCustomers.length}</div>
              <div className="flex flex-row items-center justify-end">
                <div>Per page: {perPage}</div>
                <div className="flex flex-row items-center gap-2">
                  <button className="cursor-pointer" onClick={goToPrevPage}>&larr;</button>
                  <button className="cursor-pointer" onClick={goToNextPage}>&rarr;</button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  )
}