import React from "react";
import { nanoid } from 'nanoid';
import { Phonebook } from "components/PhoneBook/PhoneBook";
import { ContactsList } from "components/Contacts/Contacts";
import { Filter } from "components/Filter/Filter";
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export class ContactBook extends React.Component {

state = {
    contacts: [],
    name: '',
    number: '',
    filter: ''
    }
    
    componentDidMount() {
        if (JSON.parse(localStorage.getItem('contacts'))) {
            this.setState({ contacts: JSON.parse(localStorage.getItem('contacts'))})
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.contacts !== prevState.contacts) {
            localStorage.setItem('contacts', JSON.stringify(this.state.contacts))
        }
    }

    getValueInput = (e) => {
        const target = e.target;
        const value = target.type === 'text' || target.type === 'tel' ?  target.value: " ";
        const elem = target.name;
        console.log(elem);
        this.setState({
            [elem]: value
        
        });
    }; 

    setContactsName = (e) => {
        e.preventDefault();
        this.setState({number: '', name: ''});      
        this.chekingContacts(e);
    };
    
    changeFilter = (e) => { this.setState({ filter: e.currentTarget.value, }) };

    contactFiltering = () => {
        const { filter, contacts } = this.state;
        const normalizeFilter = filter.toLowerCase();
        return contacts.filter(contact => contact.name.toLowerCase().includes(normalizeFilter)
            || contact.number.toLowerCase().includes(normalizeFilter));
    }

    deleteContact = (id) => {
        
        const { contacts } = this.state;
        contacts.splice(id, 1);
        this.setState({
            contacts,
        });
        console.log(this.state.contacts)
        Notify.success('The contact has been successfully deleted.');
        localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    };
   
    chekingContacts = (e) => {
        const { contacts, name, } = this.state;
        const chek = contacts.find((contact) =>contact.name === name);

            if (chek) {
                Report.failure('Error', 'This name is already in your contact list, enter another name, and try again.', 'OK');
            }         
            else {
                this.setState({ contacts: this.state.contacts.concat({ id: nanoid(), name: this.state.name, number: this.state.number }) });
                return Notify.success('Contact has been successfully added.');
            }
        };
     

        render() {
            const name = this.state.name;
            const tel = this.state.number;
            const filter = this.state.filter;
            const contacts = this.contactFiltering();
            const remove = this.deleteContact;
            
        return (< section >
            {<Phonebook input={this.getValueInput} val={{ name: name, tel: tel }} btn={this.setContactsName} />}
            <div> <h2>Contacts</h2>
                {<Filter changes={this.changeFilter}  filter={filter}/> }
                {<ContactsList contacts={contacts} away={remove} />}
            </div>
        </section >)
     

    }
}