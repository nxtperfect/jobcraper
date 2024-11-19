type PaginationProps = {
  maxPages: number,
  pageIndex: number,
  setPageIndex: (index: number) => void,
  offersPerPage: number,
  setOffersPerPage: (offersPerPage: number) => void,
};

export default function Pagination({ maxPages, pageIndex, setPageIndex, offersPerPage, setOffersPerPage }: PaginationProps) {
  const options: Array<number> = [10, 20, 50, 100];
  function handlePreviousPage() {
    if (pageIndex - 1 <= 0) {
      return;
    }
    setPageIndex(pageIndex - 1);
  }

  function handleNextPage() {
    if (pageIndex + 1 >= maxPages) {
      return;
    }
    setPageIndex(pageIndex + 1);
  }

  return (
    <div className="flex flex-col items-center justify-items-center w-full gap-4 my-8">
      <div className="flex flex-row items-center justify-items-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-xl px-1 rounded-md mr-1 text-white" onClick={() => setPageIndex(1)}>{'|<'}</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-xl px-1 rounded-md mr-1 text-white" onClick={handlePreviousPage}>{'<'}</button>
        <p><input className="bg-neutral-700 text-neutral-300 text-md px-1 rounded-md" type="number" value={pageIndex} min={1} max={maxPages} onChange={(e) => setPageIndex(Number.parseInt(e.target.value))} /> of {maxPages}</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-xl px-1 rounded-md ml-1 text-white" onClick={handleNextPage}>{'>'}</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-xl px-1 rounded-md ml-1 text-white" onClick={() => setPageIndex(maxPages)}>{'>|'}</button>
      </div>
      <div className="flex flex-row gap-2 items-center justify-items-center">
        <p>Offers per page:</p>
        <select className="bg-neutral-700 text-neutral-300 px-1 py-1 rounded-md" onChange={(e) => setOffersPerPage(Number.parseInt(e.target.value))}>
          {options.map((optionValue) => {
            if (offersPerPage === optionValue) {
              return (<option value={optionValue} selected>{optionValue}</option>)
            }
            return (<option value={optionValue}>{optionValue}</option>)
          })}
          {
            // <option value={-1}>Infinite Scroll</option>
          }
        </select>
      </div>
    </div>
  )
}

