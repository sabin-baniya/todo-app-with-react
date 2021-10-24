import React, { useState, useEffect } from 'react'

const HabitTracker = () => {

    const [input, setInput] = useState('');
    const [habit, setHabit] = useState(JSON.parse(localStorage.getItem('habits')) || []);
    const [habitList, setHabitList] = useState(JSON.parse(localStorage.getItem('habitList')) || []);
    const [showHabit, setShowHabit] = useState(false)
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
            const today = new Date().toLocaleDateString();

            //check if today's habit list has already been added by comparing date.


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

        setHabit([...habit, newHabit]);
        setInput('');
        setHabitAdded(habitAdded + 1)
    }

    useEffect(() => {
        const habitsFromLocalStorage = JSON.parse(localStorage.getItem('habits'));
        const habitListFromLocalStorage = JSON.parse(localStorage.getItem('habitList'));

        if (habitsFromLocalStorage) {
            const updatedHabitList = habitListFromLocalStorage.map((habitList) => {
                if (habitList.date === new Date().toLocaleDateString()) {
                    habitList.habits = { ...habit }
                }
                return habitList
            })

            localStorage.setItem('habitList', JSON.stringify(updatedHabitList))
        }


    }, [habitAdded])


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

    const openDiv = () => {
        setShowHabit(!showHabit)
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
                        forMap.map(({ date, completed, habits }) => (
                            <div key={date} className="habitList" onClick={openDiv}>
                                <div className="topPart">
                                    <p>{completed}/5 Completed</p>
                                    <p className="forVL">{date}</p>
                                </div>
                                <ul className="flex">
                                    {
                                        Object.keys(habits).map((key) => (
                                            <div className={showHabit ? "showHabits margin-bottom" : "habits"} key={habits[key].id}>

                                                <div className={showHabit ? "sideBySide" : "sideBySide displayBlock"}>

                                                    <input onClick={(e) => e.stopPropagation()} type="checkbox" className="checkbox" id={habits[key].id} />
                                                    <label htmlFor={habits[key].id} onClick={(e) => e.stopPropagation()}>
                                                        <li key={key} className="List">{habits[key].habit}</li>
                                                    </label>

                                                </div>
                                            </div>

                                        ))
                                    }
                                </ul>
                                <div className="arrow">
                                    {showHabit ? (<i className="fas fa-chevron-up"></i>) : (<i className="fas fa-chevron-down"></i>)}
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
