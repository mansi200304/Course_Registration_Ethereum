import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CourseRegistrationABI from './CourseRegistration.json';

const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your deployed contract address

function App() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState('');
    const [courses, setCourses] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [professorEmail, setProfessorEmail] = useState('');
    const [professorPhone, setProfessorPhone] = useState('');
    const [interestAreas, setInterestAreas] = useState('');
    const [courseCredits, setCourseCredits] = useState(0);
    const [isAvailable, setIsAvailable] = useState(true);

    // Connection with Ethereum wallet
    const connectWallet = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const account = await signer.getAddress();
            setProvider(provider);
            setSigner(signer);
            setContract(new ethers.Contract(contractAddress, CourseRegistrationABI.abi, signer));
            setAccount(account);
        } else {
            alert('Please install MetaMask!');
        }
    };

    // Fetching courses from the blockchain
    const fetchCourses = async () => {
        if (contract) {
            const courseCount = await contract.courseCount();
            let coursesArray = [];
            for (let i = 0; i < courseCount; i++) {
                const courseDetails = await contract.getCourseDetails(i);
                coursesArray.push({
                    id: i,
                    name: courseDetails[0],
                    professors: courseDetails[1],
                    email: courseDetails[2],
                    phone: courseDetails[3],
                    address: courseDetails[4],
                    interestAreas: courseDetails[5],
                    credits: courseDetails[6].toString(),
                    isAvailable: courseDetails[7]
                });
            }
            setCourses(coursesArray);
        }
    };

    // Creating a new course
    const createCourse = async () => {
        if (contract) {
            try {
                const professorsArray = []; 
                await contract.createCourse(
                    courseName,
                    professorsArray,
                    professorEmail,
                    professorPhone,
                    account,
                    interestAreas.split(','),
                    courseCredits
                );
                fetchCourses(); 
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        connectWallet();
        fetchCourses();
    }, []);

    return (
        <div>
            <h1>Course Registration</h1>
            <h2>Connected Account: {account}</h2>
            
            <div>
                <h3>Create Course</h3>
                <input 
                    type="text" 
                    placeholder="Course Name" 
                    value={courseName} 
                    onChange={(e) => setCourseName(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Professor Email" 
                    value={professorEmail} 
                    onChange={(e) => setProfessorEmail(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Professor Phone" 
                    value={professorPhone} 
                    onChange={(e) => setProfessorPhone(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Interest Areas (comma separated)" 
                    value={interestAreas} 
                    onChange={(e) => setInterestAreas(e.target.value)} 
                />
                <input 
                    type="number" 
                    placeholder="Course Credits" 
                    value={courseCredits} 
                    onChange={(e) => setCourseCredits(Number(e.target.value))} 
                />
                <label>
                    Available:
                    <input 
                        type="checkbox" 
                        checked={isAvailable} 
                        onChange={() => setIsAvailable(!isAvailable)} 
                    />
                </label>
                <button onClick={createCourse}>Create Course</button>
            </div>

            <h3>Courses List</h3>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>
                        {course.name} - Credits: {course.credits} - Available: {course.isAvailable ? 'Yes' : 'No'}
                        {/* Add more details as needed */}
                        {/* Add buttons for enrolling or viewing details */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;





import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
