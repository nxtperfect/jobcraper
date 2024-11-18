import React, { useEffect, useState, useRef, useCallback } from 'react';
import Offer from "./Offer"

interface JobOffer {
    id: string;
    title: string;
    by_company: string;
    city: string;
    additional_info: string;
    link: string;
}

type PageSize = 10 | 20 | 50 | 'all';

export default function JobOffers() {
    const [offers, setOffers] = useState<JobOffer[]>([]);
    const [pageSize, setPageSize] = useState<PageSize>(10);
    const [displayedOffers, setDisplayedOffers] = useState<JobOffer[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const observer = useRef<IntersectionObserver>();
    const lastElementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await fetch('http://localhost:8000/offers');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setOffers(data);
            } catch (error) {
                console.error('Error fetching offers:', error);
            }
        };

        fetchOffers();
    }, []);

    useEffect(() => {
        if (pageSize === 'all') {
            setDisplayedOffers(offers.slice(0, page * 10));
        } else {
            const startIndex = (page - 1) * Number(pageSize);
            const endIndex = startIndex + Number(pageSize);
            setDisplayedOffers(offers.slice(startIndex, endIndex));
        }
    }, [pageSize, offers, page]);

    const lastOfferRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && pageSize === 'all' && displayedOffers.length < offers.length) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, pageSize, displayedOffers.length, offers.length]);

    const handlePageSizeChange = (newSize: PageSize) => {
        setPageSize(newSize);
        setPage(1);
    };

    const handleNextPage = () => {
        const maxPage = pageSize === 'all' 
            ? Math.ceil(offers.length / 10)
            : Math.ceil(offers.length / Number(pageSize));
        if (page < maxPage) {
            setPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(prev => prev - 1);
        }
    };

    return (
        <div className="p-8 flex flex-col gap-4">
            <div className="mb-4 flex gap-2">
                <span className="text-neutral-200">Items per page:</span>
                {[10, 20, 50, 'all'].map((size) => (
                    <button
                        key={size}
                        onClick={() => handlePageSizeChange(size as PageSize)}
                        className={`px-3 py-1 rounded ${
                            pageSize === size 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600'
                        }`}
                    >
                        {size}
                    </button>
                ))}
            </div>
            
            {displayedOffers.map((offer, index) => (
                <div 
                    ref={index === displayedOffers.length - 1 ? lastOfferRef : null}
                    key={offer.id}
                >
                    <Offer
                        title={offer.title}
                        company={offer.by_company}
                        city={offer.city}
                        description={offer.additional_info}
                        link={offer.link}
                    />
                </div>
            ))}
            <div className="mt-4 flex justify-center gap-4">
                <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded ${
                        page === 1
                            ? 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-500'
                    }`}
                >
                    First
                </button>
                <button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded ${
                        page === 1
                            ? 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-500'
                    }`}
                >
                    Previous
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-neutral-200">Page</span>
                    <input
                        type="number"
                        min={1}
                        max={pageSize === 'all' ? Math.ceil(offers.length / 10) : Math.ceil(offers.length / Number(pageSize))}
                        value={page}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            const maxPage = pageSize === 'all' ? Math.ceil(offers.length / 10) : Math.ceil(offers.length / Number(pageSize));
                            if (value >= 1 && value <= maxPage) {
                                setPage(value);
                            }
                        }}
                        className="w-16 px-2 py-1 bg-neutral-700 text-neutral-200 rounded"
                    />
                    <span className="text-neutral-200">of {pageSize === 'all' ? Math.ceil(offers.length / 10) : Math.ceil(offers.length / Number(pageSize))}</span>
                </div>
                <button
                    onClick={handleNextPage}
                    disabled={pageSize === 'all' ? false : page >= Math.ceil(offers.length / Number(pageSize))}
                    className={`px-4 py-2 rounded ${
                        (pageSize !== 'all' && page >= Math.ceil(offers.length / Number(pageSize)))
                            ? 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-500'
                    }`}
                >
                    Next
                </button>
                <button
                    onClick={() => setPage(pageSize === 'all' ? Math.ceil(offers.length / 10) : Math.ceil(offers.length / Number(pageSize)))}
                    disabled={pageSize === 'all' ? false : page >= Math.ceil(offers.length / Number(pageSize))}
                    className={`px-4 py-2 rounded ${
                        (pageSize !== 'all' && page >= Math.ceil(offers.length / Number(pageSize)))
                            ? 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-500'
                    }`}
                >
                    Last
                </button>
            </div>
        </div>
    )
}