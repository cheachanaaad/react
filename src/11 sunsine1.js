const renderTableRows = () => {
    if (data.length > 0) {
        const filteredHeaders = ['검체 정보', '검사일', '소요일', '보험수가', '항목3', '내용'];
        const rows = data
            .filter((row) =>
                Object.values(row)
                    .join('')
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
            .filter((row) =>
                row["항목3"] === selectedData || selectedData === ''
            )
            .map((row, index) => {
                const filteredRow = {};
                for (const key in row) {
                    if (['NTL 코드', '검사항목', '보험코드'].includes(key) || filteredHeaders.includes(key)) {
                        filteredRow[key] = row[key];
                    }
                }
                return (
                    <tr key={index}>
                        {Object.values(filteredRow).map((value, index) => (
                            <td key={index}>{value}</td>
                        ))}
                    </tr>
                );
            });
        const firstHalfRows = rows.slice(0, Math.ceil(rows.length / 2));
        const secondHalfRows = rows.slice(Math.ceil(rows.length / 2), rows.length);
        return (
            <tbody>
                <tr>
                    <td colSpan={3}>
                        <table>
                            {renderTableHeader()}
                            {firstHalfRows}
                        </table>
                    </td>
                    <td colSpan={3}>
                        <table>
                            {renderTableHeader()}
                            {secondHalfRows}
                        </table>
                    </td>
                </tr>
            </tbody>
        );
    } else {
        return (
            <tbody>
                <tr>
                    <td colSpan={6}>데이터가 없습니다.</td>
                </tr>
            </tbody>
        );
    }
};