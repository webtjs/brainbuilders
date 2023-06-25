export default function MainPage({ tasks, onTaskChange }) {
    
    const handleInput = (i) => () => {
      onTaskChange(i);
    };
  
    return (
      <div class="bot">
        <h3>Deck list </h3>
        <table>
          <thead>
            <tr>
              <th>Deck No.</th>
              <th>Decktype</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{task.task}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={handleInput(i)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }