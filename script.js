document.addEventListener('DOMContentLoaded', () => {
    const cveTableBody = document.getElementById('cveTableBody');
    const addCveBtn = document.getElementById('addCveBtn');
    const cveModal = new bootstrap.Modal(document.getElementById('cveModal'));
    const cveForm = document.getElementById('cveForm');
    const saveCveBtn = document.getElementById('saveCveBtn');
    
    // Sort buttons
    const toggleCveIdSort = document.getElementById('toggleCveIdSort');
    const toggleSeveritySort = document.getElementById('toggleSeveritySort');
    const toggleCvssSort = document.getElementById('toggleCvssSort');
    const togglePackagesSort = document.getElementById('togglePackagesSort');
    const toggleCweIdSort = document.getElementById('toggleCweIdSort');
    
    // Sort icons
    const cveIdSortIcon = document.getElementById('cveIdSortIcon');
    const severitySortIcon = document.getElementById('severitySortIcon');
    const cvssSortIcon = document.getElementById('cvssSortIcon');
    const packagesSortIcon = document.getElementById('packagesSortIcon');
    const cweIdSortIcon = document.getElementById('cweIdSortIcon');

    let cveRecords = [
        { id: 'CVE-2021-32628', severity: 'HIGH', cvss: 7.5, packages: 'redis-server, redis-tools', cwe: 'CWE-190' },
        { id: 'CVE-2016-1585', severity: 'CRITICAL', cvss: 9.8, packages: 'apparmor, libapparmor1', cwe: 'CWE-254' },
        { id: 'CVE-2021-20308', severity: 'CRITICAL', cvss: 9.8, packages: 'htmldoc, htmldoc-common', cwe: 'CWE-190' },
        { id: 'CVE-2021-4048', severity: 'CRITICAL', cvss: 9.1, packages: 'libblas3', cwe: 'CWE-125' },
        { id: 'CVE-2022-36227', severity: 'CRITICAL', cvss: 9.8, packages: 'libarchive13', cwe: 'CWE-476' },
        { id: 'CVE-2021-3697', severity: 'HIGH', cvss: 7, packages: 'grub-common, grub-pc, grub-pc-bin, grub2-common', cwe: 'CWE-787' },
        { id: 'CVE-2021-38091', severity: 'HIGH', cvss: 8.8, packages: 'libavcodec58, libavutil56, libswresample3', cwe: 'CWE-190' },
        { id: 'CVE-2016-2781', severity: 'MEDIUM', cvss: 6.5, packages: 'coreutils', cwe: 'CWE-20' },
        { id: 'CVE-2016-9802', severity: 'MEDIUM', cvss: 5.3, packages: 'bluez, libbluetooth3', cwe: 'CWE-119' },
        { id: 'CVE-2019-1563', severity: 'LOW', cvss: 3.7, packages: 'libnode72', cwe: 'CWE-327' }
    ];

    let sortOrder = {
        cveId: 'asc',
        severity: 'asc',
        cvss: 'asc',
        packages: 'asc',
        cwe: 'asc'
    };

    function renderTable() {
        cveTableBody.innerHTML = '';
        cveRecords.forEach((record, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.id}</td>
                <td>${record.severity}</td>
                <td>${record.cvss}</td>
                <td>${record.packages}</td>
                <td>${record.cwe}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-btn" data-index="${index}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>
                </td>
            `;
            cveTableBody.appendChild(row);
        });
    }

    function handleFormSubmit(event) {
        event.preventDefault();

        const id = document.getElementById('cveId').value;
        const severity = document.getElementById('severity').value;
        const cvss = document.getElementById('cvss').value;
        const packages = document.getElementById('affectedPackages').value;
        const cwe = document.getElementById('cweId').value;

        const newRecord = { id, severity, cvss: parseFloat(cvss), packages, cwe };
        const index = saveCveBtn.dataset.index;

        if (index !== undefined) {
            cveRecords[index] = newRecord;
        } else {
            cveRecords.push(newRecord);
        }

        cveModal.hide();
        renderTable();
    }

    function handleEditButtonClick(event) {
        const index = event.target.dataset.index;
        const record = cveRecords[index];

        document.getElementById('cveId').value = record.id;
        document.getElementById('severity').value = record.severity;
        document.getElementById('cvss').value = record.cvss;
        document.getElementById('affectedPackages').value = record.packages;
        document.getElementById('cweId').value = record.cwe;

        saveCveBtn.dataset.index = index;
        cveModal.show();
    }

    function handleDeleteButtonClick(event) {
        const index = event.target.dataset.index;
        if (confirm('Are you sure you want to delete this CVE record?')) {
            cveRecords.splice(index, 1);
            renderTable();
        }
    }

    function sortRecordsByField(field) {
        const orderMultiplier = sortOrder[field] === 'asc' ? 1 : -1;

        cveRecords.sort((a, b) => {
            if (field === 'severity') {
                const severityOrder = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN'];
                const severityA = severityOrder.indexOf(a.severity);
                const severityB = severityOrder.indexOf(b.severity);
                return (severityA - severityB) * orderMultiplier;
            } else if (field === 'cvss') {
                return (a.cvss - b.cvss) * orderMultiplier;
            } else if (field === 'cveId') { // Corrected to 'cveId'
                return a.id.localeCompare(b.id) * orderMultiplier;
            } else {
                return a[field].localeCompare(b[field]) * orderMultiplier;
            }
        });

        sortOrder[field] = sortOrder[field] === 'asc' ? 'desc' : 'asc';
    }

    function handleSortToggle(event) {
        const field = event.target.dataset.field;
        sortRecordsByField(field);
        updateSortIcons();
        renderTable();
    }

    function updateSortIcons() {
        cveIdSortIcon.textContent = sortOrder.cveId === 'asc' ? '⬆️' : '⬇️';
        severitySortIcon.textContent = sortOrder.severity === 'asc' ? '⬆️' : '⬇️';
        cvssSortIcon.textContent = sortOrder.cvss === 'asc' ? '⬆️' : '⬇️';
        packagesSortIcon.textContent = sortOrder.packages === 'asc' ? '⬆️' : '⬇️';
        cweIdSortIcon.textContent = sortOrder.cwe === 'asc' ? '⬆️' : '⬇️';
    }

    addCveBtn.addEventListener('click', () => {
        cveForm.reset();
        delete saveCveBtn.dataset.index;
        cveModal.show();
    });

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-btn')) {
            handleEditButtonClick(event);
        } else if (event.target.classList.contains('delete-btn')) {
            handleDeleteButtonClick(event);
        } else if (event.target.classList.contains('sort-button')) {
            handleSortToggle(event);
        }
    });

    cveForm.addEventListener('submit', handleFormSubmit);
    
    // Add event listeners to sort buttons
    toggleCveIdSort.addEventListener('click', () => handleSortToggle({ target: { dataset: { field: 'cveId' }}})); // Corrected to 'cveId'
    toggleSeveritySort.addEventListener('click', () => handleSortToggle({ target: { dataset: { field: 'severity' }}}));
    toggleCvssSort.addEventListener('click', () => handleSortToggle({ target: { dataset: { field: 'cvss' }}}));
    togglePackagesSort.addEventListener('click', () => handleSortToggle({ target: { dataset: { field: 'packages' }}}));
    toggleCweIdSort.addEventListener('click', () => handleSortToggle({ target: { dataset: { field: 'cwe' }}}));

    renderTable();
});
