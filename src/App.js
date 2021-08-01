import logo from './logo.svg';
import './App.css';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Axios from "axios";
import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ImageListItem from '@material-ui/core/ImageListItem';


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);


const API_URL = "https://restcountries.eu/rest/v2/all";

const MyStateData = () => {
  const [apidata, setApidata] = useState([]);
  const [countrydata, setCountryData] = useState(true);
  React.useEffect(() => {
    Axios.get(API_URL).then((response) => {

      setApidata(response.data);
    }).catch((_error) => {
      console.log(_error);
    });

  }, []);

  return { apidata, countrydata };

}

const handleChange = (e, name, _setCountryDiv, _setStatsDiv) => {


  if (name == "country") {
    _setCountryDiv(true);
    _setStatsDiv(false);
  }
  else {
    _setCountryDiv(false);
    _setStatsDiv(true);
  }

};

const getTopLanguages = (_datas) => {
  const langs = [];
  const stats=[{name:'',value:0}];

  if (_datas !== undefined) {
    _datas.map((country) => {

      country.languages.map((lang) => {
        
          langs.push(lang.name);
       
       
    })
  })

  langs.map((lang)=>{
    
    if(stats.some(e=>e.name==lang)){
      let a=stats.find(({name})=>name==lang);
      a.value++;
    }
    else{
      stats.push({name:lang,value:1});
    }
  })

}

let count=stats.map((e)=>{ return e.value });
let countNew=count.sort(function(a,b){return b-a}).slice(0,10);
const resultStats=countNew.map((num)=>{
  let language=stats.find(({value})=>value==num);
  return language;
})



return resultStats;
}

function App() {

  const { countrydata, apidata } = MyStateData();
  const [countryDiv, setCountryDiv] = useState(true);
  const [statsDiv, setStatsDiv] = useState(false);

  const languages = getTopLanguages(apidata);
 
  return (
    <div className="App">
      <Button variant="contained" color="secondary" onClick={(e) => handleChange(e, "country", setCountryDiv, setStatsDiv)}>Ülke Listesi</Button>

      <Button name="statsDiv" onClick={(e) => handleChange(e, "stats", setCountryDiv, setStatsDiv)}>İstatistikler</Button>

      {countryDiv == true ? <div class="country-list">

        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Counrty Name</StyledTableCell>
                <StyledTableCell align="right">Flag</StyledTableCell>
                <StyledTableCell align="right">Capital&nbsp;</StyledTableCell>
                <StyledTableCell align="right">Languages&nbsp;</StyledTableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {apidata.map((data) => (
                <StyledTableRow key={data.name}>
                  <StyledTableCell component="th" scope="row">
                    {data.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <ImageListItem >
                      <img src={data.flag} width="15" height="25" />
                    </ImageListItem></StyledTableCell>
                  <StyledTableCell align="right">{data.capital}</StyledTableCell>
                  <StyledTableCell align="right">{data.languages.map((lang) => {
                    return <p>{lang.name}</p>
                  })}</StyledTableCell>

                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div> :
        <div>
           <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Language</StyledTableCell>
                <StyledTableCell>Speak Counrty Count</StyledTableCell>
               
              </TableRow>
            </TableHead>
            <TableBody>
              {languages.map((data) => (
                <StyledTableRow key={data.name}>
                  <StyledTableCell component="th" scope="row">
                    {data.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {data.value}
                    </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
      }

    </div>
  );
}

export default App;
