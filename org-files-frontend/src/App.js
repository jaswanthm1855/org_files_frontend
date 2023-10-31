import './App.css';

import { Card } from 'antd';
import OrganisationFiles from './organisationFile/organisationFiles';


function App() {
  return (
    <div className="App">
      <Card title="" bordered={false}>
        <div className='card-view'>
          <div class='org-files-comnponent'><OrganisationFiles /></div>
        </div>
      </Card>
    </div>
  );
}

export default App;
