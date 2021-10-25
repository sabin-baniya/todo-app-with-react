import React, { useState, useEffect } from 'react'

const HabitTracker = () => {

    const [input, setInput] = useState('');
    const [habit, setHabit] = useState(JSON.parse(localStorage.getItem('habits')) || []);
    const [habitList, setHabitList] = useState(JSON.parse(localStorage.getItem('habitList')) || []);
    const [habitAdded, setHabitAdded] = useState(0)

    //this is working --> ok
    useEffect(() => {
        let time = new Date().getTime();
        let startingDay = Math.ceil(time / 1000 * 60 * 60 * 24);

        const getStartingDate = localStorage.getItem('startingDate');
        if (!getStartingDate) {
            localStorage.setItem('startingDate',
                JSON.stringify({
                    startingDay,
                    startingDate: new Date().toLocaleDateString()
                }))
            return
        }
    }, [])

    //save habits to  localstorage //this is working --> ok
    useEffect(() => {
        const habits = JSON.parse(localStorage.getItem('habits')) || [];
        if (habits.length > 0) {
            if (habit.length > 0) {
                const jsonData = JSON.stringify(habit)
                localStorage.setItem('habits', jsonData)

                setHabitAdded(habitAdded + 1);
            }
            return
        } else {
            localStorage.setItem('habits', JSON.stringify(habit))
        }
        setHabitAdded(habitAdded + 1);
    }, [habit])

    //this is working --> ok
    const callAfterHabitSet = (habitListFromLocalStorage, checkArray) => {
        if (!habitListFromLocalStorage) {
            localStorage.setItem('habitList', JSON.stringify(habitList))
        }

        if (habitListFromLocalStorage) {
            if (habitListFromLocalStorage.length >= 0) {
                if (checkArray.length < habitListFromLocalStorage.length) {

                } else {
                    localStorage.setItem('habitList', JSON.stringify(habitList))

                }
            }
        }
    }

    //this will run once the website loads and checks if habitList for today is already assigned, if not assigned it will assign it.
    useEffect(() => {
        const today = new Date().toLocaleDateString()
        const startDate = JSON.parse(localStorage.getItem('startingDate'))

        const habitListFromLocalStorage = JSON.parse(localStorage.getItem('habitList'));

        const checkArray = habitListFromLocalStorage.filter((habit) => {
            if (habit.date !== today) {
                return true
            }
            return false
        })

        if (habit.length > 0) {
            if (today >= startDate.startingDate) {
                const todaysList = {
                    date: today,
                    habits: { ...habit },
                    completed: 0
                }

                if (habitListFromLocalStorage.length >= 0) {
                    if (checkArray.length < habitListFromLocalStorage.length) {

                    } else {

                        setHabitList([todaysList, ...habitList])

                    }
                }

                callAfterHabitSet(habitListFromLocalStorage, checkArray);
            }
        }
    }, [])

    const thisFunction = (newHabit) => {
        const habitsFromLocalStorage = JSON.parse(localStorage.getItem('habits'));
        const habitListFromLocalStorage = JSON.parse(localStorage.getItem('habitList'));
        let spreadedHabitList = { ...habitListFromLocalStorage }

        if (habitsFromLocalStorage) {
            const updatedHabitList = habitListFromLocalStorage.map((habitList) => {
                if (habitList.date === new Date().toLocaleDateString()) {
                    // console.log(...habit)
                    let hbt = spreadedHabitList[0].habits
                    let newHbt = Object.assign(hbt, { newHabit })
                    habitList.habits = { ...newHbt }
                    return habitList
                }
                return habitList
            })

            localStorage.setItem('habitList', JSON.stringify(updatedHabitList))
        }

    }

    //this is working --> ok
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!input || /^\s*$/.test(input)) {
            return;
        }
        const newHabit = {
            id: Math.ceil(Math.random() * 10000),
            habit: input,
            isCompleted: false
        }

        thisFunction(newHabit);

        setHabit([...habit, newHabit]);
        setInput('');
    }


    //this is working --> ok
    let doesExist = JSON.parse(localStorage.getItem('habitList')) || []

    if (doesExist.length === 0) {
        callAfterHabitSet();
    }

    //this is working --> ok
    const isTodaysHabitSet = doesExist.filter((habit) => {
        if (habit.date === new Date().toLocaleDateString()) {
            return true
        }
        return false
    })

    //this is working --> ok
    if (isTodaysHabitSet.length === 0) {
        callAfterHabitSet();

    }

    const forMap = JSON.parse(localStorage.getItem('habitList')) || []

    const [showHabit, setShowHabit] = useState(null)

    const openDiv = (index) => {
        if (showHabit === index) {
            return setShowHabit(null)
        }
        setShowHabit(index);
    }

    const checkboxFunction = (e, id) => {
        e.stopPropagation();

        const updatedHabitList = forMap.map((habit) => {
            if (habit.date === new Date().toLocaleDateString()) {
                const todaysHabitList = habit.habits;

                const keys = Object.keys(todaysHabitList)

                const todaysUpdatedHabitList = keys.map(key => {
                    if (todaysHabitList[key].id === id) {
                        todaysHabitList[key].isCompleted = !todaysHabitList[key].isCompleted
                        return todaysHabitList[key]
                    }
                    return todaysHabitList[key]
                })
                const updated = Object.assign({}, todaysUpdatedHabitList)

                habit.habits = updated
                return habit

            }
            return habit
        })

        localStorage.setItem('habitList', JSON.stringify(updatedHabitList))
    }


    return (
        <div className="mainDiv">
            <div>
                <h1 className="h1">Track Down Your Habits</h1>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="mainInput"
                        placeholder="Add new habit..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                    <button className="mainBtn">Add Habit</button>
                </form>

                <div className="habitDiv">
                    {
                        forMap.map(({ date, completed, habits }, index) => (
                            <div key={date} className="habitList"  >
                                <div className="topPart" onClick={() => openDiv(index)}>
                                    <p>{completed}/5 Completed</p>
                                    <p className="forVL">{date}</p>
                                </div>
                                {showHabit === index ? (
                                    <ul className="flex">
                                        {
                                            Object.keys(habits).map((key) => (
                                                <div className="habits" key={habits[key].id}>
                                                    <div className="sideBySide ">
                                                        <input onChange={(e) => checkboxFunction(e, habits[key].id)} type="checkbox" className="checkbox" id={habits[key].id} checked={habits[key].isCompleted} disabled={date === new Date().toLocaleDateString() ? false : true} />

                                                        <label htmlFor={habits[key].id} onClick={(e) => checkboxFunction(e, habits[key].id)}>
                                                            <li key={key} className="List">{habits[key].habit}</li>
                                                        </label>

                                                    </div>
                                                </div>

                                            ))
                                        }
                                    </ul>
                                ) : null}

                                <div className="arrow" onClick={() => openDiv(index)}>
                                    {showHabit === index ? (<i className="fas fa-chevron-up"></i>) : (<i className="fas fa-chevron-down"></i>)}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div >
        </div >
    )
}

export default HabitTracker
