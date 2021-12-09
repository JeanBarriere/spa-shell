import { determineNumber } from "!numberHelpers";
import { ChangeEvent, useMemo, useState } from "react";
import { Customer, Customers, CustomerStatus } from "types";

interface TableViewProps {
  customers: Customers
}

interface TableRowProps {
  customer: Customer
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


function TableRow ({ customer }: TableRowProps) {
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
      <td><img src="./src/components/atoms/icons/Delete.png" /></td>
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
  const [nameSortState, setNameSortState] = useState(SortState.UNDEFINED)
  const [statusSortState, setStatusSortState] = useState(SortState.UNDEFINED)


  const onNameSortChange = () => {
    setNameSortState(nextSortingState(nameSortState))
  }

  const onStatusSortChange = () => {
    setStatusSortState(nextSortingState(statusSortState))
  }

  const filteredCustomers = useMemo(() => 
    customers
    // filter with search input
    .filter(filteringFunction)
    .sort(sortFunction)
    // slice with the pagination
    .slice(0, perPage),
    [searchInput, nameSortState, statusSortState, customers]
  )
  const maxPages = useMemo(() => Math.floor(customers.length / perPage) + (customers.length % perPage === 0 ? 0 : 1), [customers, perPage])

  const onInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(evt.target.value)
  }

  const goToPrevPage = () => {
    // go to the previous page
    console.log(maxPages)
  }
  const goToNextPage = () => {
    // go to the next page
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
        {filteredCustomers.map(customer => <TableRow key={customer.id} customer={customer} />)}
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