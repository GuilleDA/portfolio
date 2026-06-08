# deck-game

Roguelike por turnos con cartas, hecho con HTML, CSS y JavaScript vanilla.

## Cómo jugar

Abrí `index.html` en el navegador.

### Modo roguelike

1. Elegí **cuántos personajes** manejás (1–4) y tu **clase**.
2. Empezás en el **piso 1** con un mazo básico:
   - 4× Golpe (ataque, 1 maná)
   - 4× Escudo (defensa, 1 maná)
   - 1× habilidad de clase (0 maná)
3. Cada piso trae una **cantidad aleatoria de enemigos** (más difíciles conforme avanzás).
4. Arriba de cada enemigo ves su **intención** para el próximo turno enemigo (a quién ataca y cuánto, o cuánto escudo gana).
5. Al limpiar un piso, elegís **1 carta nueva** para el mazo o **omitís**. Luego pasás al siguiente piso.
6. Entre pisos recuperás **5 de vida** por personaje vivo.
7. La run termina cuando caen todos tus personajes. La pantalla final muestra en qué piso caíste.

### Clases

| Clase | Habilidad (0 maná) |
|-------|---------------------|
| Guerrero | Furia — 4 de daño |
| Mago | Chispa — 2 de daño a todos |
| Sanador | Aliento — 4 de curación |
| Explorador | Disparo — 5 de daño |

### Combate

- Cada personaje tiene **3 de maná** propio. Clic en un héroe para activarlo.
- **Ataque / Defensa / Curación**: clic en carta → clic en objetivo.
- **Área**: se juega al instante.
- **Finalizar turno**: los enemigos ejecutan exactamente lo que mostraban en su intención.

## Estructura

- `index.html` — menú, combate, recompensas y game over
- `styles.css` — interfaz e intenciones enemigas
- `game.js` — run roguelike, mazo, pisos e IA predecible
