import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Navbar from "./components/Navbar"
import Home from './components/Home';
import UserList from './components/UsersList';
import AddEditUser from './components/AddEditUser';
import ReserveList from './components/ReserveList';
import TariffList from './components/TariffList';
import AddEditTariff from './components/AddEditTariff';
import AddEditSpecialDay from './components/AddEditSpecialDay';
import ReserveReports from './components/ReserveReports';
import AddEditReserve from './components/AddEditReserve';
import SpecialDayList from './components/SpecialDayList';
import ExtraHoursList from './components/ExtraHoursList';
import AddEditExtraHours from './components/AddEditExtraHours';
import NotFound from './components/NotFound';
import PaycheckList from './components/PaycheckList';
import PaycheckCalculate from './components/PaycheckCalculate';
import AnualReport from './components/AnualReport';

function App() {
  return (
      <Router>
          <div className="container">
          <Navbar></Navbar>
            <Routes>
              <Route path="/home" element={<Home/>} />
              <Route path="/user/list" element={<UserList/>} />
              <Route path="/user/add" element={<AddEditUser/>} />
              <Route path="/user/edit/:id" element={<AddEditUser/>} />
              <Route path="/reserve/list" element={<ReserveList/>} />
              <Route path="/reserve/add" element={<AddEditReserve/>} />
              <Route path="/reserve/edit/:id" element={<AddEditReserve/>} />
              <Route path="/reserve/report/:id" element={<ReserveReports/>} />
              <Route path="/specialday/list" element={<SpecialDayList/>} />
              <Route path="/specialdays/add" element={<AddEditSpecialDay />} />
              <Route path="/specialdays/edit/:id" element={<AddEditSpecialDay />} />
              <Route path="/tariff/list" element={<TariffList />} />
              <Route path="/tariff/add" element={<AddEditTariff />} />
              <Route path="/tariff/edit/:id" element={<AddEditTariff />}/>
              <Route path="/paycheck/list" element={<PaycheckList/>} />
              <Route path="/paycheck/calculate" element={<PaycheckCalculate/>} />
              <Route path="/reports/AnualReport" element={<AnualReport/>} />
              <Route path="/extraHours/list" element={<ExtraHoursList/>} />
              <Route path="/extraHours/add" element={<AddEditExtraHours/>} />
              <Route path="/extraHours/edit/:id" element={<AddEditExtraHours/>} />
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </div>
      </Router>
  );
}

export default App
