import { createRoot  } from 'react-dom/client'; // Импортируйте createRoot
import App from './components/app/App';
import './style/style.scss';


const container = document.getElementById('root'); // Получите контейнер, куда вы хотите вставить корневой компонент
const root = createRoot(container); // Создайте корень

root.render( // Используйте метод render у созданного корня
    <App />
);
