import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './page.module.css'; 

function RegisterForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [locality, setLocality] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [dni, setDni] = useState('');
  const [error, setError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [touchedFields, setTouchedFields] = useState({});
  const [cities, setCities] = useState([]);
  const [communitySelected, setCommunitySelected] = useState('');
  const [ageValid, setAgeValid] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    validateForm();
  }, [email, password, confirmPassword, firstName, lastName, birthDate, locality, municipality, dni, communitySelected]);

  const validatePassword = (password) => {
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
  };

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const validateForm = () => {
    const isValidEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
    const isPasswordValid = validatePassword(password);
    const doPasswordsMatch = password === confirmPassword;
    const isDniValid = /^\d{8}[A-Z]$/.test(dni);
    const isAgeValid = calculateAge(birthDate) >= 18;
    const isFormComplete = firstName && lastName && email && password && confirmPassword && birthDate && locality && municipality && dni  && communitySelected;

    setAgeValid(isAgeValid);
    setIsButtonDisabled(
      !(isValidEmail && isPasswordValid && doPasswordsMatch && isDniValid && isAgeValid && isFormComplete)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userData = {
      username: email,
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      birth_date: birthDate,
      locality,
      municipality,
      dni,
    };
  
    try {
      const response = await fetch('https://das-p2-backend.onrender.com/api/users/register/', { // 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const userInfo = {
          username: data.username,
          accessToken: data.access,
        };
        onLogin(data);
        localStorage.setItem("user", JSON.stringify(userInfo));
        navigate('/login'); 
      } else {
        setError(data.message || 'Error al registrar el usuario.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };
  

  const handleChange = (e) => {
    const { id, value } = e.target;
    setTouchedFields((prevTouchedFields) => ({
      ...prevTouchedFields,
      [id]: true,
    }));

    switch (id) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirm-password':
        setConfirmPassword(value);
        break;
      case 'first-name':
        setFirstName(value);
        break;
      case 'last-name':
        setLastName(value);
        break;
      case 'birth-date':
        setBirthDate(value);
        break;
      case 'locality':
        setLocality(value);
        break;
      case 'municipality':
        setMunicipality(value);
        break;
      case 'dni':
        setDni(value);
        break;
      case 'community':
        setCommunitySelected(value);
        break;
      default:
        break;
    }

    if (id === 'password') {
      const isPasswordValid = validatePassword(value);
      setError(isPasswordValid ? '' : 'Password must be at least 8 characters long and contain at least one letter and one number');
    }

    if (id === 'confirm-password') {
      const doPasswordsMatch = value === password;
      setError(doPasswordsMatch ? '' : 'Passwords do not match');
    }

    validateForm();
  };

  const updateCities = () => {
    const citiesByCommunity = {
      "Andalucia": ["Almeria", "Cadiz", "Cordoba", "Granada", "Huelva", "Jaen", "Malaga", "Sevilla"],
      "Aragon": ["Huesca", "Teruel", "Zaragoza"],
      "Asturias": ["Asturias"],
      "Islas-Baleares": ["Islas-Baleares"],
      "Islas-Canarias": ["Las-Palmas", "Santa-Cruz-de-Tenerife"],
      "Cantabria": ["Cantabria"],
      "Castilla-Leon": ["Avila", "Burgos", "Leon", "Palencia", "Salamanca", "Segovia", "Soria", "Valladolid", "Zamora"],
      "Castilla-La Mancha": ["Albacete", "Ciudad Real", "Cuenca", "Guadalajara", "Toledo"],
      "Cataluna": ["Barcelona", "Girona", "Lleida", "Tarragona"],
      "Valencia": ["Alicante", "Castellon", "Valencia"],
      "Extremadura": ["Badajoz", "Caceres"],
      "Galicia": ["Coruna", "Lugo", "Ourense", "Pontevedra"],
      "Madrid": ["Madrid"],
      "Murcia": ["Murcia"],
      "Navarra": ["Navarra"],
      "Ceuta": ["Ceuta"],
      "Melilla": ["Melilla"],
      "Pais-Vasco": ["Alava", "Bizkaia", "Gipuzkoa"],
      "La-Rioja": ["La-Rioja"]
    };

    const selectedCommunity = communitySelected;
    if (selectedCommunity && citiesByCommunity[selectedCommunity]) {
      setCities(citiesByCommunity[selectedCommunity]);
    }
  };

  useEffect(() => {
    updateCities();
  }, [communitySelected]);

  return (
    <div className={styles['register-page']}>
      <section className={styles['form-container-register-page']}>
        <article className={styles['form-box-register-page']}>
          <h1 id="h1-register-page">Create your account</h1>
          {error && <p className={styles['error-message']}>{error}</p>}
          <form onSubmit={handleSubmit} className={styles['form-register-page']}>
            <label htmlFor="first-name">First Name</label>
            <input type="text" id="first-name" placeholder="Enter your First Name" value={firstName} onChange={handleChange} required/>

            <label htmlFor="last-name">Last Name</label>
            <input
              type="text"
              id="last-name"
              placeholder="Enter your Last Name"
              value={lastName}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              value={email}
              onChange={handleChange}
              required
            />
            {touchedFields.email && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email) && (
              <p className={styles['error-message']}>Invalid email format</p>
            )}

            <label htmlFor="birth-date">Birth Date</label>
            <input
              type="date"
              id="birth-date"
              value={birthDate}
              onChange={handleChange}
              required
              min="1925-01-01"
              max="2094-12-31"
            />
            {touchedFields.birthDate && calculateAge(birthDate) < 18 && (
              <p className={styles['error-message']}>You must be at least 18 years old</p>
            )}

            <label htmlFor="dni">DNI</label>
            <input
              type="text"
              id="dni"
              placeholder="Enter your DNI"
              value={dni}
              onChange={handleChange}
              required
            />
            {touchedFields.dni && !/^\d{8}[A-Z]$/.test(dni) && (
              <p className={styles['error-message']}>Invalid DNI format</p>
            )}

            <label htmlFor="community">Community</label>
            <select id="community" value={communitySelected} onChange={handleChange} required>
              <option value="">Select a Community</option>
              <option value="Andalucia">Andalucia</option>
              <option value="Aragon">Aragon</option>
              <option value="Asturias">Asturias</option>
              <option value="Cantabria">Cantabria</option>
              <option value="Castilla-La Mancha">Castilla-La Mancha</option>
              <option value="Castilla-Leon">Castilla-Leon</option>
              <option value="Cataluna">Cataluna</option>
              <option value="Ceuta">Ceuta</option>
              <option value="Extremadura">Extremadura</option>
              <option value="Galicia">Galicia</option>
              <option value="Islas-Baleares">Islas-Baleares</option>
              <option value="Islas-Canarias">Islas-Canarias</option>
              <option value="La-Rioja">La-Rioja</option>
              <option value="Madrid">Madrid</option>
              <option value="Melilla">Melilla</option>
              <option value="Murcia">Murcia</option>
              <option value="Navarra">Navarra</option>
              <option value="Pais-Vasco">Pais-Vasco</option>
              <option value="Valencia">Valencia</option>
            </select>

            <label htmlFor="municipality">City</label>
            <select
              id="municipality"
              value={municipality}
              onChange={handleChange}
              required
            >
              <option value="">Select a City</option>
              {cities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={handleChange}
              required
            />
            {touchedFields.password && password.length < 8 && (
              <p className={styles['error-message']}>Password must be at least 8 characters long</p>
            )}

            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={handleChange}
              required
            />
            {touchedFields.confirmPassword && password !== confirmPassword && (
              <p className={styles['error-message']}>Passwords do not match</p>
            )}

            <button type="submit">Register</button>
          </form>
        </article>
      </section>
    </div>
  );
}

export default RegisterForm;

