import { createContext, useState, useContext, useEffect } from 'react';
const MovementContext = createContext();

export const MovementProvider = ({ children }) => {
    const [keys, setKeys] = useState({
        w: { pressed: false },
        a: { pressed: false },
        s: { pressed: false },
        d: { pressed: false }
    });
    useEffect(() => {
        window.addEventListener('load', () => {
            const canvas = document.getElementById('gameCanvas');
            const c = canvas.getContext('2d');
            const playerImg = new Image();
            playerImg.src = '/assets/player.png';
            playerImg.onload = () => {
                c.drawImage(playerImg, 0, 0);
            }
        });
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'w':
                    setKeys(prev => ({ ...prev, w: { pressed: true } }));
                    break;
                case 'a':
                    setKeys(prev => ({ ...prev, a: { pressed: true } }));
                    break;
                case 's':
                    setKeys(prev => ({ ...prev, s: { pressed: true } }));
                    break;
                case 'd':
                    setKeys(prev => ({ ...prev, d: { pressed: true } }));
                    break;
                default:
                    break;
            }
        };
        const handleKeyUp = (event) => {
            switch (event.key) {
                case 'w':
                    setKeys(prev => ({ ...prev, w: { pressed: false } }));
                    break;
                case 'a':
                    setKeys(prev => ({ ...prev, a: { pressed: false } }));
                    break;
                case 's':
                    setKeys(prev => ({ ...prev, s: { pressed: false } }));
                    break;
                case 'd':
                    setKeys(prev => ({ ...prev, d: { pressed: false } }));
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return (
        <MovementContext.Provider value={{ keys }}>
            {children}
        </MovementContext.Provider>
    );
}