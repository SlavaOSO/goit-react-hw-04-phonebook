import PropTypes from 'prop-types';
import { ListContacts } from './Contacts.styled';

export const ContactsList = ({ contacts, away }) => {
    return (<ListContacts>
        {contacts.map(contact => <li key={contact.id}>
            {contact.name}: {contact.number}
            <button type="button" onClick={() => away(contact.id)} >delete</button>
        </li>)}
    </ListContacts>)
};


ContactsList.propTypes = {
    contacts: PropTypes.array.isRequired,
    away: PropTypes.func.isRequired
};