import { useState, useEffect, useMemo } from "react";
import { nanoid } from 'nanoid';
import { Phonebook } from "components/PhoneBook/PhoneBook";
import { ContactsList } from "components/Contacts/Contacts";
import { Filter } from "components/Filter/Filter";
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export const ContactBook = () => {
    const [contacts, setContacts] = useState(() => JSON.parse(window.localStorage.getItem('contacts')) ?? []);
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        window.localStorage.setItem('contacts', JSON.stringify(contacts))
    });


    const getValueInput = (e) => {
        const { type, value } = e.target;
        switch (type) {
            case 'text':
                setName(value);
                break;
            case 'tel':
                setNumber(value);
                break;
            default:
                return;
        }
    }; 
    

    const setContactsName = (e) => {
        e.preventDefault();
        setNumber('');
        setName('');
        
        chekingContacts(e);
    };
    
    const changeFilter = (e) => { setFilter(e.currentTarget.value) };

    const contactFiltering = useMemo(() => {
        const normalizeFilter = filter.toLowerCase();
        return contacts.filter(contact => contact.name.toLowerCase().includes(normalizeFilter)
            || contact.number.toLowerCase().includes(normalizeFilter));
    },[contacts,filter])

    const deleteContact = (id) => {
        
        contacts.splice(id, 1);
        setContacts([...contacts]);
        console.log(contacts)
        Notify.success('The contact has been successfully deleted.');
        localStorage.setItem('contacts', JSON.stringify(contacts));
    };
   
    const chekingContacts = () => {
        const chek = contacts.find((contact) =>contact.name === name);

            if (chek) {
                Report.failure('Error', 'This name is already in your contact list, enter another name, and try again.', 'OK');
            }         
            else {
                setContacts(contacts.concat({ id: nanoid(), name: name, number: number }) );
                return Notify.success('Contact has been successfully added.');
            }
        };


    return (< section >
            {<Phonebook input={getValueInput} val={{ name: name, tel: number }} btn={setContactsName} />}
            <div> <h2>Contacts</h2>
                {<Filter changes={changeFilter}  filter={filter}/> }
                {<ContactsList contacts={contactFiltering} away={deleteContact} />}
            </div>
        </section >)
}
