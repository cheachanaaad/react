import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './style.css';
import { ImSearch } from "react-icons/im";
import React from 'react';


function App() {
  const [data, setData] = useState([]);
  const [numRecords, setNumRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [buttonData, setButtonData] = useState([]);
  const [selectedData, setSelectedData] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [변수높이, setHeight] = useState(300);
  const [showImage, setShowImage] = useState(false); //보여줘 이미지

  const csv데이터불러오기 = () => {
    Papa.parse('/su1.csv', {
      download: true,
      header: true,
      complete: (results) => {
        setData(results.data);
        setNumRecords(results.data.length);
        const uniqueButtonData = [...new Set(results.data.map(row => row['항목3']))].filter(Boolean);

        setButtonData(uniqueButtonData);
        // alert(`불러온 데이터: ${uniqueButtonData.length}개\n\n데이터: ${uniqueButtonData.join(", ")}`);

      },
      error: (error) => {
        // alert('데이터를 불러오는 중에 에러가 발생했습니다.');
        console.error(error);
      }
    });
  };

  useEffect(() => {
    csv데이터불러오기();
    setTimeout(() => setShowImage(true),300);
  }, []);

  const 테이블헤드 = () => {
    if (data.length > 0) {
      const filteredHeaders = Object.keys(data[0]).filter(header => ['NTL 코드', '검사항목', '보험코드'].includes(header));
      const headers = filteredHeaders.map(header => <th key={header}>{header}</th>);

      return (
        <thead>
          <tr>{headers}</tr>
        </thead>
      );
    } else {
      return null;
    }
  };

  const 테이블바디클릭 = (row) => {
    setSelectedRow(row);
  }

  const 테이블바디 = () => {
    if (data.length > 0) {
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
            if (['NTL 코드', '검사항목', '보험코드'].includes(key)) {
              filteredRow[key] = row[key];
            }
          }
          const isSelected = selectedRow && Object.values(row).join() === Object.values(selectedRow).join();
          const className = isSelected ? "selected" : "";
          return (
            <tr key={index} className={className} onClick={() => 테이블바디클릭(row)}>
              {Object.values(filteredRow).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          );
        });
      return <tbody >{rows}</tbody>;
    } else {
      return (
        <tbody >
          <tr>
            <td colSpan={3}>데이터가 없습니다.</td>
          </tr>
        </tbody>
      );
    }
  };
  const 데이터상세창 = () => {
    if (selectedRow !== null) {
      return (
        <div className="병건">
          <p>검체정보:<a>{selectedRow.검체정보}</a> </p>
          <p>검 사 일:   <a>{selectedRow.검사일}</a></p>
          <p>소 요 일:   <a>{selectedRow.소요일}</a></p>
          <p>보험코드:   <a>{selectedRow.보험코드}</a></p>
          <p>보험수가:   <a>{selectedRow.보험수가}원</a></p>
          <p>진단방법:   <a>{selectedRow.항목3}</a></p>
          <p>검사내용:   <a> {selectedRow.내용}</a></p>
  
        </div>
        
      );
    } else {
      return (
        <div className="병건">
          <p>검체정보: </p>
          <p>검사일: </p>
          <p>소요일: </p>
          <p>보험코드: </p>
          <p>보험수가: </p>
          <p>진단방법: </p>
          <p>검사내용: </p>
   
        </div>
      );
    }
  };

  const 분류버튼 = () => {
    const allButton = (
      <button
        key="all"
        onClick={() => setSelectedData('')}
        className={selectedData === '' ? 'active' : ''}
      >
        All
      </button>
    );

    if (buttonData.length > 0) {
      const buttons = buttonData.map((button, index) => (
        <button
          key={index}
          onClick={() => setSelectedData(button)}
          className={selectedData === button ? 'active' : ''}
        >
          {button}
        </button>
      ));

      return <div className="button-container">{[allButton, ...buttons]}</div>;

    } else {
      return null;
    }
  };

  function 비어버튼() {
    return <h3> Lets go for a <ImSearch />? </h3>;
  }
  

  function 로고이미지() {
    if (showImage) {
      return (
        <div>
          <img src="http://www.ntllab.com/ko/images/logo.gif" alt="Sun" className="logo-image" style={{ opacity: 0.1 }}/>
         
        </div>
      );
    } else {
      return (
        <div>
       <img src="http://www.ntllab.com/ko/images/logo.gif" alt="Sun" className="logo-image" />
         
        </div>
      );
    }
  }






  return (
    
    <div>{로고이미지()}  


      <div className="box">
        
        <span className="icon"><ImSearch /></span>
        <input type="text" id="search" placeholder="Search" value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedData(''); // all 버튼 자동으로 누르기
          }}
          className="search-input" />

      </div>
      <input
        type="range"
        min="100"
        max="600"
        value={변수높이}
        onChange={(event) => setHeight(event.target.value)}
        className="실린더"
        style={{
          width: "90%",
          height: '20%',
          position: "sticky",
          top: "10px",
          left: "20vh",
        }}
      />
     

      {/* {비어버튼()} */}
      {분류버튼()}

     



        <div className="table-container" style={{ height: `${변수높이}px` }}>
          <table>
            {테이블헤드()}
            {테이블바디()}

          </table>

        </div>
        {데이터상세창()}

    

      {/* {numRecords > 0 ? <p>불러온 데이터: {numRecords} 건</p> : null} */}
    </div>
  );
}
export default App;