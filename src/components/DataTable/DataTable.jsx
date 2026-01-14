import { useState, useMemo } from 'react';
import './DataTable.css';

const DataTable = ({
    data = [],
    columns = [],
    onEdit,
    onDelete,
    onView,
    customActions,
    editButtonText = 'Edit',
    deleteButtonText = 'Delete',
    loading = false,
    emptyMessage = 'No data available',
    searchable = true,
    searchPlaceholder = 'Search...',
    itemsPerPage = 10
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const getCellValue = (item, accessor) => {
        if (typeof accessor === 'function') {
            return accessor(item);
        }
        return item[accessor];
    };

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        return data.filter(item =>
            columns.some(col => {
                const value = getCellValue(item, col.accessor);
                return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
            })
        );
    }, [data, searchQuery, columns]);

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;
        return [...filteredData].sort((a, b) => {
            const col = columns.find(c => (typeof c.accessor === 'string' ? c.accessor : c.header) === sortConfig.key);
            if (!col) return 0;
            const aVal = getCellValue(a, col.accessor) || '';
            const bVal = getCellValue(b, col.accessor) || '';
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig, columns]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const handleSort = (col) => {
        const key = typeof col.accessor === 'string' ? col.accessor : col.header;
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getColumnKey = (col, index) => {
        return typeof col.accessor === 'string' ? col.accessor : `col-${index}`;
    };

    if (loading) {
        return <div className="data-table-loading">Loading...</div>;
    }

    return (
        <div className="data-table-container">
            {searchable && (
                <div className="table-search">
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            )}

            {paginatedData.length === 0 ? (
                <div className="empty-message">{emptyMessage}</div>
            ) : (
                <>
                    <table className="data-table">
                        <thead>
                            <tr>
                                {columns.map((col, index) => (
                                    <th key={getColumnKey(col, index)} onClick={() => handleSort(col)}>
                                        {col.header}
                                        {sortConfig.key === getColumnKey(col, index) && (
                                            <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                                        )}
                                    </th>
                                ))}
                                {(onEdit || onDelete || onView || customActions) && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item, rowIndex) => (
                                <tr key={item._id || item.id || rowIndex}>
                                    {columns.map((col, colIndex) => (
                                        <td key={getColumnKey(col, colIndex)}>
                                            {col.render
                                                ? col.render(getCellValue(item, col.accessor), item)
                                                : getCellValue(item, col.accessor)}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete || onView || customActions) && (
                                        <td className="actions">
                                            {onView && <button onClick={() => onView(item)} className="btn-view">View</button>}
                                            {onEdit && <button onClick={() => onEdit(item)} className="btn-edit">{editButtonText}</button>}
                                            {onDelete && <button onClick={() => onDelete(item)} className="btn-delete">{deleteButtonText}</button>}
                                            {customActions && customActions(item)}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>First</button>
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>Last</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DataTable;