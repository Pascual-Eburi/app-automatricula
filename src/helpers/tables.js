
import $ from 'jquery';
import moment from 'moment';
import 'datatables.net';
import Swal from 'sweetalert2';
import { extractExams, getGradeStatus } from './General';

const GenerateDataTable = function ( ) {
    // Define shared variables
    var table_id;
    var table;
    var datatable;
    var toolbarBase;
    var toolbarSelected;
    var selectedCount;

    var no_orderable;
    var per_page;

    // Private functions
    var initDatatable = function () {
        // Set date data order
/*         tableRows.forEach(row => {
            const dateRow = row.querySelectorAll('td');
            //const realDate = moment(dateRow[5].innerHTML, "DD MMM YYYY, LT").format(); // select date from 4th column in table
            //dateRow[5].setAttribute('data-order', realDate);
        }); */

        // Init datatable --- more info on datatables: https://datatables.net/manual/
        if (!$.fn.DataTable.isDataTable(table)) {
            // Inicializar la tabla
            //$('#kt_subscriptions_table').DataTable();
            datatable = $(table).DataTable({
                "info": false,
                'order': [],
                "pageLength": per_page,
                "lengthChange": false,
                'columnDefs': [
                    {
                        "targets": no_orderable,
                        "orderable": false
                    },
                    //{ orderable: false, targets: 0 }, // Disable ordering on column 0 (checkbox)
                    //{ orderable: false, targets: 6 }, // Disable ordering on column 6 (actions)                
                ],"language": {
                    "emptyTable": "No se encontraron registros",
                    "zeroRecords": "No se encontraron registros para su búsqueda",
                    "search": "Buscar:",
                  },
            });

            
          }

        // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw
        datatable.on('draw', function () {
            initToggleToolbar();
            handleRowDeletion();
            toggleToolbars();
        });
    }

    // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
    var handleSearch = function () {
        const filterSearch = document.querySelector('[data-table-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            datatable.search(e.target.value).draw();
        });
    }

    // Filter Datatable
    var handleFilter = function () {
        // Select filter options
        const filterForm = document.querySelector('[data-table-filter="form"]');
        const filterButton = filterForm.querySelector('[data-table-filter="filter"]');
        const resetButton = filterForm.querySelector('[data-table-filter="reset"]');
        const selectOptions = filterForm.querySelectorAll('select');

        // Filter datatable on submit
        filterButton.addEventListener('click', function () {
            var filterString = '';

            // Get filter values
            selectOptions.forEach((item, index) => {
                if (item.value && item.value !== '') {
                    if (index !== 0) {
                        filterString += ' ';
                    }

                    // Build filter value options
                    filterString += item.value;
                }
            });

            // Filter datatable --- official docs reference: https://datatables.net/reference/api/search()
            datatable.search(filterString).draw();
        });

        // Reset datatable
        resetButton.addEventListener('click', function () {
            // Reset filter form
            selectOptions.forEach((item, index) => {
                // Reset Select2 dropdown --- official docs reference: https://select2.org/programmatic-control/add-select-clear-items
                $(item).val(null).trigger('change');
            });

            // Filter datatable --- official docs reference: https://datatables.net/reference/api/search()
            datatable.search('').draw();
        });
    }

    // Delete subscirption
    var handleRowDeletion = function () {
        // Select all delete buttons
        const deleteButtons = table.querySelectorAll('[data-kt-subscriptions-table-filter="delete_row"]');

        deleteButtons.forEach(d => {
            // Delete button on click
            d.addEventListener('click', function (e) {
                e.preventDefault();

                // Select parent row
                const parent = e.target.closest('tr');

                // Get customer name
                const customerName = parent.querySelectorAll('td')[1].innerText;

                // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                Swal.fire({
                    text: "Are you sure you want to delete " + customerName + "?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes, delete!",
                    cancelButtonText: "No, cancel",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then(function (result) {
                    if (result.value) {
                        Swal.fire({
                            text: "You have deleted " + customerName + "!.",
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary",
                            }
                        }).then(function () {
                            // Remove current row
                            datatable.row($(parent)).remove().draw();
                        }).then(function () {
                            // Detect checked checkboxes
                            toggleToolbars();
                        });
                    } else if (result.dismiss === 'cancel') {
                        Swal.fire({
                            text: customerName + " was not deleted.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary",
                            }
                        });
                    }
                });
            })
        });
    }

    // Init toggle toolbar
    var initToggleToolbar = () => {
        // Toggle selected action toolbar


        // Select all checkboxes
        const checkboxes = table.querySelectorAll('[type="checkbox"]');

        // Select elements
        toolbarBase = document.querySelector('[data-table-toolbar="base"]');
        toolbarSelected = document.querySelector('[data-table-toolbar="selected"]');
        selectedCount = document.querySelector('[data-table-select="selected_count"]');
        const deleteSelected = document.querySelector('[data-table-select="delete_selected"]');

        // Toggle delete selected toolbar
        checkboxes.forEach(c => {
            // Checkbox on click event
            c.addEventListener('click', function () {
                setTimeout(function () {
                    toggleToolbars();
                }, 50);
            });
        });

        // Deleted selected rows
        if (deleteSelected){
            deleteSelected.addEventListener('click', function () {
                // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
                Swal.fire({
                    text: "Are you sure you want to delete selected customers?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Yes, delete!",
                    cancelButtonText: "No, cancel",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then(function (result) {
                    if (result.value) {
                        Swal.fire({
                            text: "You have deleted all selected customers!.",
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary",
                            }
                        }).then(function () {
                            // Remove all selected customers
                            checkboxes.forEach(c => {
                                if (c.checked) {
                                    datatable.row($(c.closest('tbody tr'))).remove().draw();
                                }
                            });
    
                            // Remove header checked box
                            const headerCheckbox = table.querySelectorAll('[type="checkbox"]')[0];
                            headerCheckbox.checked = false;
                        }).then(function () {
                            toggleToolbars(); // Detect checked checkboxes
                            initToggleToolbar(); // Re-init toolbar to recalculate checkboxes
                        });
                    } else if (result.dismiss === 'cancel') {
                        Swal.fire({
                            text: "Selected customers was not deleted.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, got it!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary",
                            }
                        });
                    }
                });
            });

        }
    }

    // Toggle toolbars
    const toggleToolbars = () => {
        // Select refreshed checkbox DOM elements 
        const allCheckboxes = table.querySelectorAll('tbody [type="checkbox"]');

        // Detect checkboxes state & count
        let checkedState = false;
        let count = 0;

        // Count checked boxes
        allCheckboxes.forEach(c => {
            if (c.checked) {
                checkedState = true;
                count++;
            }
        });

        // Toggle toolbars
        if (checkedState) {
            selectedCount.innerHTML = count;
            toolbarBase.classList.add('d-none');
            if (toolbarSelected) {toolbarSelected.classList.remove('d-none');}
        } else {
            toolbarBase.classList.remove('d-none');
            if (toolbarSelected) {toolbarSelected.classList.add('d-none');}
        }
    }

    return {
        // Public functions  
        init: function (config) {
            table_id = config.table_id;
            per_page = config.per_page;
            no_orderable = config.no_orderable;

            table = document.getElementById(table_id);
        
            
            if (!table) {return;}

            initDatatable();
            initToggleToolbar();
            handleSearch();
            handleRowDeletion();
            handleFilter();
        }
    }
}();

export default GenerateDataTable;

/*-----------------------------------------------------------------------------
   DATABLE WITH SUBTABLE GENERATOR
------------------------------------------------------------------------------*/

// Class definition
export const GenerateDataTableSubtable = function () {
    var table;
    var datatable;
    var template;
    var cloned;
    var data;
    var grades;

    var table_id;
    var no_orderable;
    var per_page;

    // Private methods
    const initDatatable = () => {

        // Get subtable template
        const subtable = document.querySelector('[data-datatable-subtable="subtable_template"]');
        if(subtable){
            cloned = subtable.cloneNode(true);

        }

        template = subtable ? subtable.cloneNode(true) : cloned ;
            
        template.classList.remove('d-none');

        // Remove subtable template
        if(subtable){

            subtable.parentNode.removeChild(subtable);
        }

        // Init datatable --- more info on datatables: https://datatables.net/manual/
        if (!$.fn.DataTable.isDataTable(table)) {
            datatable = $(table).DataTable({
                "info": false,
                'order': [],
                "lengthChange": false,
                'pageLength': per_page,
                'ordering': false,
                'paging': false,
                'columnDefs': [
                    {
                        "targets": no_orderable,
                        "orderable": false
                    },
                ]
            });
        }else{

           
        }


        // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw
        datatable.on('draw', function () {
            console.log('LLEGANDO AQUI')
            resetSubtable();
            handleActionButton();
        });
    }

    // Subtable data sample
    
/*     data = [
        {
            image: '76',
            name: 'Go Pro 8',
            description: 'Latest  version of Go Pro.',
            cost: '500.00',
            qty: '1',
            total: '500.00',
            stock: '12'
        },
        {
            image: '60',
            name: 'Bose Earbuds',
            description: 'Top quality earbuds from Bose.',
            cost: '300.00',
            qty: '1',
            total: '300.00',
            stock: '8'
        },
        {
            image: '211',
            name: 'Dry-fit Sports T-shirt',
            description: 'Comfortable sportswear for everyday use.',
            cost: '89.00',
            qty: '1',
            total: '89.00',
            stock: '18'
        },
        {
            image: '21',
            name: 'Apple Airpod 3',
            description: 'Apple\'s latest and most advanced earbuds.',
            cost: '200.00',
            qty: '2',
            total: '400.00',
            stock: '32'
        },
        {
            image: '83',
            name: 'Nike Pumps',
            description: 'Apple\'s latest and most advanced headphones.',
            cost: '200.00',
            qty: '1',
            total: '200.00',
            stock: '8'
        }
    ]; */

    // Handle action button
    const handleActionButton = () => {
        const buttons = document.querySelectorAll('[data-datatable-subtable="expand_row"]');

        // Sample row items counter --- for demo purpose only, remove this variable in your project
   
        buttons.forEach((button, index) => {
            button.addEventListener('click', e => {
                e.stopImmediatePropagation();
                e.preventDefault();

                const row = button.closest('tr');
                const enrollment = row.getAttribute('data-enrollment');
                const exams = grades[enrollment];
  

                const rowClasses = ['isOpen', 'border-bottom-0','shadow-sm'];

                // Handle subtable expanded state
                if (row.classList.contains('isOpen')) {
                    // Remove all subtables from current order row
                    while (row.nextSibling && row.nextSibling.getAttribute('data-datatable-subtable') === 'subtable_template') {
                        row.nextSibling.parentNode.removeChild(row.nextSibling);
                    }

                    row.classList.remove(...rowClasses);
                    button.classList.remove('active');

                } else {
                    populateTemplate(exams, row);
                    row.classList.add(...rowClasses);
                    button.classList.add('active');
                }
            });
        });
    }

    // Populate template with content/data -- content/data can be replaced with relevant data from database or API
    const cualifications = {
        Suspenso: `<span class="badge badge-light-danger">Suspenso</span>`,
        Aprobado: `<span class="badge badge-light-primary">Aprobado</span>`,
        Notable: `<span class="badge badge-light-info">Notable</span>`,
        Sobresaliente: `<span class="badge badge-light-success">Sobresaliente</span>`,


    }
    const populateTemplate = (data, target) => {
        const {name, exams} = data;
        exams.forEach((exam, index) => {
            // Clone template node
            const newTemplate = template.cloneNode(true);
           
            // Stock badges
            const fail = `<div class="badge badge-light-warning">Suspenso</div>`;
            const texto = `<span class="badge badge-light-primary">In Progress</span><span class="badge badge-light-primary">In Progress</span>`;

            const aproved = `<div class="badge badge-light-success">Aprobado</div>`;

            // Select data elements
            const subject = newTemplate.querySelector('[data-datatable-subtable="template_subject"]');

            const announcement = newTemplate.querySelector('[data-datatable-subtable="template_announcement"]');

            const date = newTemplate.querySelector('[data-datatable-subtable="template_exam_date"]');

            const time = newTemplate.querySelector('[data-datatable-subtable="template_time"]');

            const grade = newTemplate.querySelector('[data-datatable-subtable="template_grade"]');

            const status = newTemplate.querySelector('[data-datatable-subtable="template_status"]');

            // Populate elements with data
 
            subject.innerText = exam.subject;

            announcement.innerText = `${exam.phase} - ${name}`;

            date.innerText = exam.exam_date;
            time.innerText = `${exam.start_time} - ${exam.end_time}`;
            grade.innerText = exam.grade;

            if ( exam.grade >= 0) {
                const cualification = getGradeStatus(exam.grade);
                status.innerHTML = cualifications[cualification];
            } else {
                status.innerHTML = '';
            } 

            // New template border controller
            // When only 1 row is available
            if (data.length === 1) {
                let borderClasses = ['rounded', 'rounded-end-0'];
                newTemplate.querySelectorAll('td')[0].classList.add(...borderClasses);
                borderClasses = ['rounded', 'rounded-start-0'];
                newTemplate.querySelectorAll('td')[4].classList.add(...borderClasses);

                // Remove bottom border
                newTemplate.classList.add('border-bottom-0');
            } else {
                // When multiple rows detected
                if (index === (data.length - 1)) { // first row
                    let borderClasses = ['rounded-start', 'rounded-bottom-0'];
                    newTemplate.querySelectorAll('td')[0].classList.add(...borderClasses);
                    borderClasses = ['rounded-end', 'rounded-bottom-0'];
                    newTemplate.querySelectorAll('td')[4].classList.add(...borderClasses);
                }
                if (index === 0) { // last row
                    let borderClasses = ['rounded-start', 'rounded-top-0'];
                    newTemplate.querySelectorAll('td')[0].classList.add(...borderClasses);
                    borderClasses = ['rounded-end', 'rounded-top-0'];
                    newTemplate.querySelectorAll('td')[4].classList.add(...borderClasses);

                    // Remove bottom border on last row
                    newTemplate.classList.add('border-bottom-0');
                }
            }

            // Insert new template into table
            const tbody = table.querySelector('tbody');
            tbody.insertBefore(newTemplate, target.nextSibling);
        });
    }

    // Reset subtable
    const resetSubtable = () => {
        const subtables = document.querySelectorAll('[data-datatable-subtable="subtable_template"]');
        subtables.forEach(st => {
            st.parentNode.removeChild(st);
        });

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(r => {
            r.classList.remove('isOpen');
            if (r.querySelector('[data-datatable-subtable="expand_row"]')) {
                r.querySelector('[data-datatable-subtable="expand_row"]').classList.remove('active');
            }
        });
    }

    // Public methods
    return {
        init: function (config) {
            table_id = config.table_id;
            per_page = config.per_page || 20;
            no_orderable = config.no_orderable || [0];
            data = config.data;
            grades = extractExams(data);

            table = document.getElementById(table_id);
            //table = document.querySelector(`#${table_id}`);

            if (!table) { return; }
            setTimeout(function(){
                initDatatable();
                handleActionButton();

            }, 5000)
        }
    }
}();






