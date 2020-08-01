// Classes ********************************************
class Resource {
    constructor(title, author, url) {
      this.title = title;
      this.author = author;
      this.url = url;
    }
  }
class UI {
    static displayResources() {
      const resources = Store.getResources();
  
      resources.forEach((resource) => UI.addResourceToList(resource));
    }
  
    static addResourceToList(resource) {
      const list = document.querySelector('#resource-list');
  
      const row = document.createElement('tr');

      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      today = dd + '/' + mm;
  
      row.innerHTML = `
        <td>${resource.title}</td>
        <td>${resource.author}</td>
        <td>${resource.url}</td>
        <td>${today}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      `;
  
      list.appendChild(row);
    }
  
    static deleteResource(el) {
      if(el.classList.contains('delete')) {
        el.parentElement.parentElement.remove();
      }
    }
  
    static showAlert(message, className) {
      const div = document.createElement('div');
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('#resource-form');
      container.insertBefore(div, form);
  
      // Vanish in 3 seconds
      setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
  
    static clearFields() {
      document.querySelector('#title').value = '';
      document.querySelector('#author').value = '';
      document.querySelector('#url').value = '';
    }
  }
  
  class Store {
    static getResources() {
      let resources;
      if(localStorage.getItem('resources') === null) {
        resources = [];
      } else {
        resources = JSON.parse(localStorage.getItem('resources'));
      }
  
      return resources;
    }
  
    static addResource(resource) {
      const resources = Store.getResources();
      resources.push(resource);
      localStorage.setItem('resources', JSON.stringify(resources));
    }
  
    static removeResource(url) {
      const resources = Store.getResources();
  
      resources.forEach((resource, index) => {
        if(resource.url === url) {
          resources.splice(index, 1);
        }
      });
  
      localStorage.setItem('resources', JSON.stringify(resources));
    }
  }
  
// Events ********************************************
  document.addEventListener('DOMContentLoaded', UI.displayResources);
  
  // Adding a resource
  document.querySelector('#resource-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();
  
    // retrieving values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const url = document.querySelector('#url').value;
  
    // validation
    if(title === '' || author === '' || url === '') {
      UI.showAlert('Please fill in all fields', 'danger');
    } else {
      const resource = new Resource(title, author, url);
      UI.addResourceToList(resource);
      Store.addResource(resource);
      UI.showAlert('Source Added', 'success');
      UI.clearFields();
    }
  });
  
  // Removal
  document.querySelector('#resource-list').addEventListener('click', (e) => {
    UI.deleteResource(e.target);
    Store.removeResource(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Source Removed', 'success');
  });