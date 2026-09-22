/* InventSoft - script principal
   Inyecta la barra lateral, marca la página activa y llena las tablas con datos de demostración.
   Los datos se guardan en localStorage.
*/

(function () {
    'use strict';

    var MENU = [
        ['dashboard', 'Dashboard'],
        ['inventario', 'Inventario'],
        ['entradas', 'Entradas y salidas'],
        ['stock', 'Stock en tiempo real'],
        ['alertas', 'Alertas'],
        ['pedidos', 'Pedidos a proveedores'],
        ['reportes', 'Reportes'],
        ['usuarios', 'Usuarios y roles'],
        ['niveles', 'Niveles de stock'],
        ['exportar', 'Exportar datos']
    ];

    var DEFAULTS = {
        materiales: [
            {
                cod: 'MAT-001',
                nombre: 'Lámina cold rolled cal. 18',
                cat: 'Láminas',
                unidad: 'Unidad',
                stock: 42,
                min: 15
            },
            {
                cod: 'MAT-002',
                nombre: 'Pintura poliuretano blanca',
                cat: 'Pinturas',
                unidad: 'Galón',
                stock: 8,
                min: 10
            },
            {
                cod: 'MAT-003',
                nombre: 'Masilla plástica',
                cat: 'Consumibles',
                unidad: 'Kilo',
                stock: 30,
                min: 12
            },
            {
                cod: 'MAT-004',
                nombre: 'Lija P320',
                cat: 'Consumibles',
                unidad: 'Pliego',
                stock: 120,
                min: 50
            },
            {
                cod: 'MAT-005',
                nombre: 'Lija P800',
                cat: 'Consumibles',
                unidad: 'Pliego',
                stock: 0,
                min: 40
            },
            {
                cod: 'MAT-006',
                nombre: 'Thinner',
                cat: 'Pinturas',
                unidad: 'Galón',
                stock: 25,
                min: 10
            },
            {
                cod: 'MAT-007',
                nombre: 'Barniz automotriz',
                cat: 'Pinturas',
                unidad: 'Galón',
                stock: 6,
                min: 8
            },
            {
                cod: 'MAT-008',
                nombre: 'Cinta de enmascarar',
                cat: 'Consumibles',
                unidad: 'Rollo',
                stock: 64,
                min: 30
            },
            {
                cod: 'MAT-009',
                nombre: 'Disco de corte 4½"',
                cat: 'Herramientas',
                unidad: 'Unidad',
                stock: 48,
                min: 20
            },
            {
                cod: 'MAT-010',
                nombre: 'Alambre MIG 0.8 mm',
                cat: 'Soldadura',
                unidad: 'Rollo',
                stock: 0,
                min: 6
            },
            {
                cod: 'MAT-011',
                nombre: 'Primer epóxico',
                cat: 'Pinturas',
                unidad: 'Galón',
                stock: 14,
                min: 6
            },
            {
                cod: 'MAT-012',
                nombre: 'Guantes de nitrilo',
                cat: 'Seguridad',
                unidad: 'Caja',
                stock: 22,
                min: 10
            }
        ],

        movimientos: [
            {
                fecha: '2025-09-10',
                cod: 'MAT-002',
                tipo: 'Salida',
                cant: 3,
                resp: 'Carlos Pinto',
                ref: 'O.T. 1045'
            },
            {
                fecha: '2025-09-09',
                cod: 'MAT-001',
                tipo: 'Entrada',
                cant: 20,
                resp: 'Yonathan Mendoza',
                ref: 'Factura F-2231'
            },
            {
                fecha: '2025-09-08',
                cod: 'MAT-005',
                tipo: 'Salida',
                cant: 40,
                resp: 'Andrea Ruiz',
                ref: 'O.T. 1041'
            },
            {
                fecha: '2025-09-06',
                cod: 'MAT-007',
                tipo: 'Salida',
                cant: 2,
                resp: 'Carlos Pinto',
                ref: 'O.T. 1039'
            },
            {
                fecha: '2025-09-05',
                cod: 'MAT-004',
                tipo: 'Entrada',
                cant: 60,
                resp: 'Yonathan Mendoza',
                ref: 'Factura F-2198'
            },
            {
                fecha: '2025-09-04',
                cod: 'MAT-010',
                tipo: 'Salida',
                cant: 6,
                resp: 'Luis Ortega',
                ref: 'O.T. 1036'
            },
            {
                fecha: '2025-09-03',
                cod: 'MAT-003',
                tipo: 'Entrada',
                cant: 15,
                resp: 'Yonathan Mendoza',
                ref: 'Factura F-2175'
            }
        ],

        pedidos: [
            {
                fecha: '2025-09-09',
                prov: 'Pinturas del Norte',
                cod: 'MAT-002',
                cant: 12,
                urg: 'Alta',
                estado: 'Enviado'
            },
            {
                fecha: '2025-09-08',
                prov: 'Aceros Bogotá',
                cod: 'MAT-010',
                cant: 10,
                urg: 'Alta',
                estado: 'Pendiente'
            }
        ],

        usuarios: [
            {
                nombre: 'Yonathan Mendoza',
                rol: 'Administrador',
                correo: 'admin@inventsoft.com',
                activo: true
            },
            {
                nombre: 'Carlos Pinto',
                rol: 'Operario',
                correo: 'cpinto@inventsoft.com',
                activo: true
            },
            {
                nombre: 'Andrea Ruiz',
                rol: 'Operario',
                correo: 'aruiz@inventsoft.com',
                activo: true
            },
            {
                nombre: 'Luis Ortega',
                rol: 'Usuario',
                correo: 'lortega@inventsoft.com',
                activo: true
            },
            {
                nombre: 'Marta Salcedo',
                rol: 'Usuario',
                correo: 'msalcedo@inventsoft.com',
                activo: false
            }
        ]
    };

    var KEY = 'inventsoft-demo-v1';

    var db;

    try {
        db = JSON.parse(localStorage.getItem(KEY));
    } catch (e) {
        db = null;
    }

    if (!db) {
        db = JSON.parse(JSON.stringify(DEFAULTS));
    }

    // Migración preventiva de roles antiguos a nuevos
    if (db && db.usuarios) {
        db.usuarios.forEach(function (u) {
            if (u.rol === 'Mecánico' || u.rol === 'Pintor') {
                u.rol = 'Operario';
            }
        });
    }

    function save() {
        try {
            localStorage.setItem(KEY, JSON.stringify(db));
        } catch (e) {}
    }

    /* ---------- utilidades ---------- */

    function $(s, r) {
        return (r || document).querySelector(s);
    }

    function $$(s, r) {
        return Array.prototype.slice.call(
            (r || document).querySelectorAll(s)
        );
    }

    function esc(t) {
        return String(t).replace(/[&<>"]/g, function (c) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;'
            }[c];
        });
    }

    function estado(m) {
        return m.stock <= 0
            ? 'out'
            : (m.stock <= m.min ? 'low' : 'ok');
    }

    function estadoTxt(m) {
        return {
            ok: 'Suficiente',
            low: 'Bajo stock',
            out: 'Agotado'
        }[estado(m)];
    }

    function badge(m) {
        return '<span class="badge ' +
            estado(m) +
            '">' +
            estadoTxt(m) +
            '</span>';
    }

    function mat(cod) {
        return db.materiales.filter(function (m) {
            return m.cod === cod;
        })[0];
    }

    function fecha(f) {
        var p = f.split('-');

        return p[2] + '/' + p[1] + '/' + p[0];
    }

    function tbody(id, rows) {
        var el = document.getElementById(id);

        if (el) {
            el.innerHTML = rows;
        }

        return el;
    }

    function toast(msg) {
        var t = document.createElement('div');

        t.className = 'toast';
        t.setAttribute('role', 'status');
        t.textContent = msg;

        document.body.appendChild(t);

        setTimeout(function () {
            t.remove();
        }, 3200);
    }

    window.InventSoft = {
        toast: toast
    };

    /* ---------- barra lateral y barra superior ---------- */

    function shell() {
        var page = document.body.getAttribute('data-page');

        var side = $('#sidebar');

        if (side) {
            var links = MENU.map(function (m) {
                return '<a href="' +
                    m[0] +
                    '.html"' +
                    (m[0] === page
                        ? ' class="active" aria-current="page"'
                        : '') +
                    '>' +
                    m[1] +
                    '</a>';
            }).join('');

            side.innerHTML =
                '<div class="brand">InventSoft</div>' +

                '<div class="profile">' +
                    '<div class="avatar">YM</div>' +
                    '<div>' +
                        '<strong>Yonathan Mendoza</strong>' +
                        '<span>@Inventsoft</span>' +
                    '</div>' +
                '</div>' +

                '<nav class="nav" aria-label="Menú principal">' +
                    links +
                '</nav>' +

                '<div class="foot">' +
                    '<a href="mapa-navegacion.html" style="color:#dbe6ff">' +
                        'Mapa de navegación' +
                    '</a>' +
                    '<br>' +
                    '<a href="login.html" style="color:#dbe6ff">' +
                        'Cerrar sesión' +
                    '</a>' +
                '</div>';
        }

        var bar = document.getElementById('topbar');

        if (bar) {
            var criticos = db.materiales.filter(function (m) {
                return estado(m) !== 'ok';
            }).length;

            bar.innerHTML =
                '<div class="left">' +

                    '<button class="menu-btn" id="menu-btn" aria-label="Abrir menú">' +
                        '☰' +
                    '</button>' +

                    '<h2>' +
                        esc(bar.getAttribute('data-title') || '') +
                    '</h2>' +

                '</div>' +

                '<a class="bell" href="alertas.html" aria-label="Notificaciones: ' +
                    criticos +
                    ' alertas">' +

                    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
                        '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>' +
                        '<path d="M13.7 21a2 2 0 0 1-3.4 0"/>' +
                    '</svg>' +

                    (
                        criticos
                            ? '<span class="count">' + criticos + '</span>'
                            : ''
                    ) +

                '</a>';

            var btn = $('#menu-btn');

            if (btn) {
                btn.addEventListener('click', function () {
                    side.classList.toggle('open');
                });
            }
        }
    }

    /* ---------- dashboard ---------- */

    function movRows(list) {
        return list.map(function (x) {
            var m = mat(x.cod) || {
                nombre: x.cod
            };

            return '<tr>' +
                '<td>' + fecha(x.fecha) + '</td>' +
                '<td>' + esc(m.nombre) + '</td>' +

                '<td>' +
                    '<span class="badge ' +
                        (x.tipo === 'Entrada' ? 'in' : 'low') +
                    '">' +
                        x.tipo +
                    '</span>' +
                '</td>' +

                '<td>' + x.cant + '</td>' +
                '<td>' + esc(x.resp) + '</td>' +
                '<td>' + esc(x.ref) + '</td>' +
            '</tr>';
        }).join('');
    }

    function renderDashboard() {
        var k = $('#kpis');

        if (!k) {
            return;
        }

        var total = db.materiales.length;

        var bajo = db.materiales.filter(function (m) {
            return estado(m) === 'low';
        }).length;

        var ago = db.materiales.filter(function (m) {
            return estado(m) === 'out';
        }).length;

        var disp = Math.round(
            ((total - ago) / total) * 100
        );

        k.innerHTML =
            '<div class="card kpi">' +
                '<div class="label">Materiales registrados</div>' +
                '<div class="value">' + total + '</div>' +
            '</div>' +

            '<div class="card kpi warn">' +
                '<div class="label">Stock bajo</div>' +
                '<div class="value">' + bajo + '</div>' +
            '</div>' +

            '<div class="card kpi bad">' +
                '<div class="label">Agotados</div>' +
                '<div class="value">' + ago + '</div>' +
            '</div>' +

            '<div class="card kpi good">' +
                '<div class="label">Disponibilidad</div>' +
                '<div class="value">' + disp + '%</div>' +
            '</div>';

        tbody(
            'tbl-mov',
            movRows(db.movimientos.slice(0, 5))
        );
    }

    /* ---------- inventario ---------- */

    function renderInventario() {
        var body = document.getElementById('tbl-inv');

        if (!body) {
            return;
        }

        var q = (
            $('#buscar') &&
            $('#buscar').value ||
            ''
        ).toLowerCase();

        var rows = db.materiales
            .filter(function (m) {
                return (
                    m.nombre +
                    m.cod +
                    m.cat
                )
                    .toLowerCase()
                    .indexOf(q) !== -1;
            })
            .map(function (m) {
                return '<tr>' +
                    '<td>' + m.cod + '</td>' +
                    '<td>' + esc(m.nombre) + '</td>' +
                    '<td>' + m.cat + '</td>' +
                    '<td>' + m.unidad + '</td>' +
                    '<td>' + m.stock + '</td>' +
                    '<td>' + m.min + '</td>' +
                    '<td>' + badge(m) + '</td>' +
                '</tr>';
            })
            .join('');

        body.innerHTML =
            rows ||
            '<tr>' +
                '<td colspan="7" class="muted">' +
                    'No hay materiales que coincidan con la búsqueda.' +
                '</td>' +
            '</tr>';

        charts();
    }

    function charts() {
        var bars = $('#chart-bars');
        var donut = $('#chart-donut');

        if (bars) {
            var cats = {};

            db.materiales.forEach(function (m) {
                cats[m.cat] =
                    (cats[m.cat] || 0) +
                    m.stock;
            });

            var names = Object.keys(cats);

            var max =
                Math.max.apply(
                    null,
                    names.map(function (n) {
                        return cats[n];
                    })
                ) || 1;

            bars.innerHTML = names.map(function (n) {
                return '<div class="bar">' +
                    '<b>' + cats[n] + '</b>' +
                    '<i style="height:' +
                        Math.round(
                            cats[n] / max * 150
                        ) +
                        'px"></i>' +
                '</div>';
            }).join('');

            var lab = $('#chart-labels');

            if (lab) {
                lab.innerHTML = names.map(function (n) {
                    return '<span>' + n + '</span>';
                }).join('');
            }
        }

        if (donut) {
            var c = {
                ok: 0,
                low: 0,
                out: 0
            };

            db.materiales.forEach(function (m) {
                c[estado(m)]++;
            });

            var t = db.materiales.length || 1;

            var a =
                c.ok / t * 360;

            var b =
                a +
                c.low / t * 360;

            donut.style.background =
                'conic-gradient(' +
                '#059669 0 ' + a + 'deg,' +
                '#f59e0b ' + a + 'deg ' + b + 'deg,' +
                '#dc2626 ' + b + 'deg 360deg)';

            var lg = $('#chart-legend');

            if (lg) {
                lg.innerHTML =
                    '<div>' +
                        '<i style="background:#059669"></i>' +
                        'Suficiente: ' + c.ok +
                    '</div>' +

                    '<div>' +
                        '<i style="background:#f59e0b"></i>' +
                        'Bajo stock: ' + c.low +
                    '</div>' +

                    '<div>' +
                        '<i style="background:#dc2626"></i>' +
                        'Agotado: ' + c.out +
                    '</div>';
            }
        }
    }

    /* ---------- entradas y salidas ---------- */

    function renderMovForm() {
        var sel = $('#mov-mat');
        var form = $('#mov-form');

        if (!sel || !form) {
            return;
        }

        sel.innerHTML = db.materiales.map(function (m) {
            return '<option value="' +
                m.cod +
                '">' +
                m.cod +
                ' - ' +
                esc(m.nombre) +
                '</option>';
        }).join('');

        var f = $('#mov-fecha');

        if (f && !f.value) {
            f.value =
                new Date().toISOString().slice(0, 10);
        }

        tbody(
            'tbl-kardex',
            movRows(db.movimientos)
        );

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var m = mat(sel.value);

            var cant =
                parseInt(
                    $('#mov-cant').value,
                    10
                );

            var tipo =
                $('#mov-tipo').value;

            var msg =
                $('#mov-error');

            if (!cant || cant < 1) {
                msg.textContent =
                    'Escribe una cantidad mayor que cero.';

                return;
            }

            if (
                tipo === 'Salida' &&
                cant > m.stock
            ) {
                msg.textContent =
                    'La salida supera el stock disponible (' +
                    m.stock +
                    ').';

                return;
            }

            msg.textContent = '';

            m.stock +=
                tipo === 'Entrada'
                    ? cant
                    : -cant;

            db.movimientos.unshift({
                fecha: $('#mov-fecha').value,
                cod: m.cod,
                tipo: tipo,
                cant: cant,
                resp: $('#mov-resp').value,
                ref: $('#mov-ref').value || '-'
            });

            save();

            tbody(
                'tbl-kardex',
                movRows(db.movimientos)
            );

            form.reset();

            $('#mov-fecha').value =
                new Date().toISOString().slice(0, 10);

            toast(
                tipo +
                ' registrada correctamente.'
            );
        });
    }

    /* ---------- stock en tiempo real ---------- */

    function renderStock() {
        var cards = $('#stock-cards');

        if (!cards) {
            return;
        }

        var c = {
            ok: 0,
            low: 0,
            out: 0
        };

        db.materiales.forEach(function (m) {
            c[estado(m)]++;
        });

        cards.innerHTML =
            '<div class="card light">' +
                '<span class="dot ok"></span>' +
                '<div>' +
                    '<h3>' + c.ok + ' suficientes</h3>' +
                    '<span class="muted">Sin riesgo de paro</span>' +
                '</div>' +
            '</div>' +

            '<div class="card light">' +
                '<span class="dot low"></span>' +
                '<div>' +
                    '<h3>' + c.low + ' con bajo stock</h3>' +
                    '<span class="muted">Conviene reponer</span>' +
                '</div>' +
            '</div>' +

            '<div class="card light">' +
                '<span class="dot out"></span>' +
                '<div>' +
                    '<h3>' + c.out + ' agotados</h3>' +
                    '<span class="muted">Reponer ya</span>' +
                '</div>' +
            '</div>';

        tbody(
            'tbl-stock',

            db.materiales.map(function (m) {

                var act =
                    estado(m) === 'ok'
                        ? '<span class="muted">Sin acción</span>'
                        : '<a class="btn sm cyan" href="pedidos.html?mat=' +
                            m.cod +
                            '">Reponer</a>';

                return '<tr>' +
                    '<td>' + esc(m.nombre) + '</td>' +
                    '<td>' +
                        m.stock +
                        ' ' +
                        m.unidad.toLowerCase() +
                    '</td>' +
                    '<td>' + m.min + '</td>' +
                    '<td>' + badge(m) + '</td>' +
                    '<td>' + act + '</td>' +
                '</tr>';
            }).join('')
        );
    }

    /* ---------- alertas ---------- */

    function renderAlertas() {
        var box = $('#alert-list');

        if (!box) {
            return;
        }

        var out = db.materiales.filter(function (m) {
            return estado(m) === 'out';
        });

        var low = db.materiales.filter(function (m) {
            return estado(m) === 'low';
        });

        var ok = db.materiales.filter(function (m) {
            return estado(m) === 'ok';
        });

        var html = '';

        if (out.length) {
            html +=
                '<div class="card alert risk">' +
                    '<div>' +
                        '<h3>Riesgo de paro en el taller</h3>' +

                        '<p>' +
                            out.length +
                            ' material(es) agotado(s): ' +

                            out.map(function (m) {
                                return esc(m.nombre);
                            }).join(', ') +

                            '.' +
                        '</p>' +
                    '</div>' +

                    '<a class="btn danger" href="pedidos.html">' +
                        'Crear pedido urgente' +
                    '</a>' +
                '</div>';
        }

        out.forEach(function (m) {
            html +=
                '<div class="card alert crit">' +
                    '<div>' +
                        '<h3>Crítica: ' +
                            esc(m.nombre) +
                        '</h3>' +

                        '<p class="muted">' +
                            'Agotado. Mínimo requerido: ' +
                            m.min +
                            ' ' +
                            m.unidad.toLowerCase() +
                            '.' +
                        '</p>' +
                    '</div>' +

                    '<a class="btn sm" href="pedidos.html?mat=' +
                        m.cod +
                        '">' +
                        'Pedir ahora' +
                    '</a>' +
                '</div>';
        });

        low.forEach(function (m) {
            html +=
                '<div class="card alert mid">' +
                    '<div>' +
                        '<h3>Media: ' +
                            esc(m.nombre) +
                        '</h3>' +

                        '<p class="muted">' +
                            'Quedan ' +
                            m.stock +
                            ' de un mínimo de ' +
                            m.min +
                            '.' +
                        '</p>' +
                    '</div>' +

                    '<a class="btn sm ghost" href="pedidos.html?mat=' +
                        m.cod +
                        '">' +
                        'Programar pedido' +
                    '</a>' +
                '</div>';
        });

        html +=
            '<div class="card alert opt">' +
                '<div>' +
                    '<h3>Óptima</h3>' +
                    '<p class="muted">' +
                        ok.length +
                        ' materiales con stock por encima del mínimo.' +
                    '</p>' +
                '</div>' +

                '<a class="btn sm ghost" href="stock.html">' +
                    'Ver stock' +
                '</a>' +
            '</div>';

        box.innerHTML = html;
    }

    /* ---------- pedidos ---------- */

    function renderPedidos() {
        var form = $('#ped-form');

        if (!form) {
            return;
        }

        var sel = $('#ped-mat');

        sel.innerHTML =
            db.materiales.map(function (m) {
                return '<option value="' +
                    m.cod +
                    '">' +
                    m.cod +
                    ' - ' +
                    esc(m.nombre) +
                    '</option>';
            }).join('');

        var pre =
            new URLSearchParams(location.search)
                .get('mat');

        if (pre) {
            sel.value = pre;
        }

        function list() {
            tbody(
                'tbl-ped',

                db.pedidos.map(function (p) {
                    var m =
                        mat(p.cod) ||
                        {
                            nombre: p.cod
                        };

                    return '<tr>' +
                        '<td>' + fecha(p.fecha) + '</td>' +
                        '<td>' + esc(p.prov) + '</td>' +
                        '<td>' + esc(m.nombre) + '</td>' +
                        '<td>' + p.cant + '</td>' +
                        '<td>' + p.urg + '</td>' +

                        '<td>' +
                            '<span class="badge ' +
                                (
                                    p.estado === 'Enviado'
                                        ? 'ok'
                                        : 'low'
                                ) +
                            '">' +
                                p.estado +
                            '</span>' +
                        '</td>' +

                    '</tr>';
                }).join('')
            );
        }

        list();

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            db.pedidos.unshift({
                fecha:
                    new Date()
                        .toISOString()
                        .slice(0, 10),

                prov:
                    $('#ped-prov').value,

                cod:
                    sel.value,

                cant:
                    parseInt(
                        $('#ped-cant').value,
                        10
                    ) || 1,

                urg:
                    $('#ped-urg').value,

                estado:
                    'Pendiente'
            });

            save();

            list();

            form.reset();

            toast('Pedido registrado.');
        });
    }

    /* ---------- reportes ---------- */

    function renderReportes() {
        var body =
            document.getElementById('tbl-rep');

        if (!body) {
            return;
        }

        var cat = $('#rep-cat');
        var cats = [];

        db.materiales.forEach(function (m) {
            if (cats.indexOf(m.cat) < 0) {
                cats.push(m.cat);
            }
        });

        cat.innerHTML =
            '<option value="">Todas</option>' +

            cats.map(function (c) {
                return '<option>' +
                    c +
                    '</option>';
            }).join('');

        function draw() {
            var d = $('#rep-desde').value;
            var h = $('#rep-hasta').value;
            var c = cat.value;

            var rows =
                db.movimientos.filter(function (x) {
                    var m = mat(x.cod);

                    return (
                        (!d || x.fecha >= d) &&
                        (!h || x.fecha <= h) &&
                        (!c || (m && m.cat === c))
                    );
                });

            body.innerHTML =
                rows.length

                    ? rows.map(function (x) {
                        var m =
                            mat(x.cod) ||
                            {
                                nombre: x.cod,
                                cat: '-'
                            };

                        return '<tr>' +
                            '<td>' + fecha(x.fecha) + '</td>' +
                            '<td>' + esc(m.nombre) + '</td>' +
                            '<td>' + m.cat + '</td>' +
                            '<td>' + x.tipo + '</td>' +
                            '<td>' + x.cant + '</td>' +
                            '<td>' + esc(x.resp) + '</td>' +
                            '<td>' + esc(x.ref) + '</td>' +
                        '</tr>';
                    }).join('')

                    : '<tr>' +
                        '<td colspan="7" class="muted">' +
                            'No hay movimientos en ese rango.' +
                        '</td>' +
                    '</tr>';
        }

        [
            '#rep-desde',
            '#rep-hasta',
            '#rep-cat'
        ].forEach(function (s) {
            $(s).addEventListener(
                'change',
                draw
            );
        });

        draw();
    }

    /* ---------- usuarios ---------- */

    function renderUsuarios() {
        var body =
            document.getElementById('tbl-usr');

        if (!body) {
            return;
        }

        // Roles requeridos:
        // Administrador, Operario, Usuario
        var roles = [
            'Administrador',
            'Operario',
            'Usuario'
        ];

        function draw() {
            body.innerHTML =
                db.usuarios.map(function (u, i) {

                    // Fallback preventivo para normalizar roles
                    var currentRol = u.rol;

                    if (roles.indexOf(currentRol) === -1) {
                        currentRol =
                            currentRol === 'Pintor' ||
                            currentRol === 'Mecánico'
                                ? 'Operario'
                                : 'Usuario';

                        u.rol = currentRol;
                    }

                    var opts =
                        roles.map(function (r) {
                            return '<option value="' +
                                r +
                                '"' +
                                (
                                    r === currentRol
                                        ? ' selected'
                                        : ''
                                ) +
                                '>' +
                                r +
                                '</option>';
                        }).join('');

                    return '<tr>' +

                        '<td style="text-align:center">' +
                            '<input type="checkbox" class="chk-usr" data-i="' +
                                i +
                                '" aria-label="Seleccionar usuario ' +
                                esc(u.nombre) +
                                '">' +
                        '</td>' +

                        '<td>' +
                            esc(u.nombre) +
                        '</td>' +

                        '<td>' +
                            esc(u.correo) +
                        '</td>' +

                        '<td>' +
                            '<select data-i="' +
                                i +
                                '" class="rol" style="width:auto">' +
                                opts +
                            '</select>' +
                        '</td>' +

                        '<td>' +
                            '<span class="badge ' +
                                (
                                    u.activo
                                        ? 'ok'
                                        : 'out'
                                ) +
                            '">' +
                                (
                                    u.activo
                                        ? 'Activo'
                                        : 'Bloqueado'
                                ) +
                            '</span>' +
                        '</td>' +

                        '<td>' +
                            '<button class="btn sm ' +
                                (
                                    u.activo
                                        ? 'ghost'
                                        : ''
                                ) +
                                '" data-i="' +
                                i +
                                '" data-act="bloq">' +

                                (
                                    u.activo
                                        ? 'Bloquear'
                                        : 'Activar'
                                ) +

                            '</button>' +
                        '</td>' +

                    '</tr>';
                }).join('');

            var chkAll =
                $('#select-all-usr');

            if (chkAll) {
                chkAll.checked = false;
            }
        }

        draw();

        // Eventos tabla
        body.addEventListener(
            'change',
            function (e) {

                if (
                    e.target.classList.contains('rol')
                ) {
                    db.usuarios[
                        e.target.getAttribute('data-i')
                    ].rol =
                        e.target.value;

                    save();

                    toast(
                        'Rol actualizado.'
                    );
                }
            }
        );

        body.addEventListener(
            'click',
            function (e) {

                if (
                    e.target.getAttribute(
                        'data-act'
                    ) === 'bloq'
                ) {
                    var u =
                        db.usuarios[
                            e.target.getAttribute(
                                'data-i'
                            )
                        ];

                    u.activo = !u.activo;

                    save();

                    draw();
                }
            }
        );

        // Checkbox seleccionar todos
        var selectAll =
            $('#select-all-usr');

        if (selectAll) {
            selectAll.addEventListener(
                'change',
                function () {

                    $$('.chk-usr', body)
                        .forEach(function (chk) {
                            chk.checked =
                                selectAll.checked;
                        });
                }
            );
        }

        // Botón para mostrar formulario de registro
        var btnNuevo =
            $('#btn-nuevo-usuario');

        var cardNuevo =
            $('#card-nuevo-usr');

        var btnCerrar =
            $('#btn-cerrar-form-usr');

        var formNuevo =
            $('#form-nuevo-usr');

        if (btnNuevo && cardNuevo) {
            btnNuevo.addEventListener(
                'click',
                function () {

                    cardNuevo.style.display =
                        'block';

                    cardNuevo.scrollIntoView({
                        behavior: 'smooth'
                    });

                    var inpNom =
                        $('#usr-nombre');

                    if (inpNom) {
                        inpNom.focus();
                    }
                }
            );
        }

        if (btnCerrar && cardNuevo) {
            btnCerrar.addEventListener(
                'click',
                function () {
                    cardNuevo.style.display =
                        'none';
                }
            );
        }

        if (formNuevo) {
            formNuevo.addEventListener(
                'submit',
                function (e) {
                    e.preventDefault();

                    var nom =
                        (
                            $('#usr-nombre').value ||
                            ''
                        ).trim();

                    var mail =
                        (
                            $('#usr-correo').value ||
                            ''
                        ).trim();

                    var rol =
                        $('#usr-rol').value;

                    if (!nom || !mail) {
                        return;
                    }

                    // Validar correo existente
                    var existe =
                        db.usuarios.some(
                            function (u) {
                                return (
                                    u.correo.toLowerCase() ===
                                    mail.toLowerCase()
                                );
                            }
                        );

                    if (existe) {
                        toast(
                            'Ya existe un usuario con este correo electrónico.'
                        );

                        return;
                    }

                    db.usuarios.push({
                        nombre: nom,
                        correo: mail,
                        rol: rol,
                        activo: true
                    });

                    save();

                    draw();

                    formNuevo.reset();

                    cardNuevo.style.display =
                        'none';

                    toast(
                        'Usuario ' +
                        nom +
                        ' registrado correctamente.'
                    );
                }
            );
        }

        // Botón eliminar usuario
        var btnEliminar =
            $('#btn-eliminar-usuario');

        if (btnEliminar) {
            btnEliminar.addEventListener(
                'click',
                function () {

                    var seleccionados =
                        $$('.chk-usr:checked', body)
                            .map(function (chk) {
                                return parseInt(
                                    chk.getAttribute(
                                        'data-i'
                                    ),
                                    10
                                );
                            });

                    if (!seleccionados.length) {
                        toast(
                            'Selecciona al menos un usuario con la casilla para eliminarlo.'
                        );

                        return;
                    }

                    var confirmar =
                        confirm(
                            '¿Estás seguro de que deseas eliminar ' +
                            seleccionados.length +
                            ' usuario(s) seleccionado(s)?'
                        );

                    if (!confirmar) {
                        return;
                    }

                    // Filtrar usuarios no seleccionados
                    db.usuarios =
                        db.usuarios.filter(
                            function (_, idx) {
                                return (
                                    seleccionados.indexOf(
                                        idx
                                    ) === -1
                                );
                            }
                        );

                    save();

                    draw();

                    toast(
                        'Usuario(s) eliminado(s) correctamente.'
                    );
                }
            );
        }
    }

    /* ---------- niveles ---------- */

    function renderNiveles() {
        var body =
            document.getElementById('tbl-niv');

        if (!body) {
            return;
        }

        body.innerHTML =
            db.materiales.map(function (m, i) {

                return '<tr>' +
                    '<td>' +
                        esc(m.nombre) +
                    '</td>' +

                    '<td>' +
                        m.stock +
                    '</td>' +

                    '<td>' +
                        '<input type="number" min="0" value="' +
                            m.min +
                            '" data-i="' +
                            i +
                            '" aria-label="Mínimo de ' +
                            esc(m.nombre) +
                        '">' +
                    '</td>' +

                    '<td>' +
                        badge(m) +
                    '</td>' +

                '</tr>';

            }).join('');

        $('#niv-guardar').addEventListener(
            'click',
            function () {

                $$(
                    'input[data-i]',
                    body
                ).forEach(function (inp) {

                    db.materiales[
                        inp.getAttribute('data-i')
                    ].min =
                        parseInt(
                            inp.value,
                            10
                        ) || 0;
                });

                save();

                renderNiveles();

                shell();

                toast(
                    'Niveles guardados. Las alertas se recalcularon.'
                );
            }
        );
    }

    /* ---------- exportar ---------- */

    function csvFrom(table, name) {
        var rows =
            $$('tr', table).map(
                function (tr) {

                    return $$(
                        'th,td',
                        tr
                    ).map(
                        function (c) {

                            return '"' +
                                c.textContent
                                    .replace(/"/g, '""')
                                    .trim() +
                                '"';
                        }
                    ).join(';');
                }
            );

        var blob =
            new Blob(
                [
                    '\ufeff' +
                    rows.join('\n')
                ],
                {
                    type:
                        'text/csv;charset=utf-8'
                }
            );

        var a =
            document.createElement('a');

        a.href =
            URL.createObjectURL(blob);

        a.download =
            name +
            '.csv';

        document.body.appendChild(a);

        a.click();

        a.remove();
    }

    function exportModule() {
        var data = {

            inventario: function () {

                return tableFromRows(
                    [
                        'Código',
                        'Material',
                        'Categoría',
                        'Unidad',
                        'Stock',
                        'Mínimo',
                        'Estado'
                    ],

                    db.materiales.map(
                        function (m) {

                            return [
                                m.cod,
                                m.nombre,
                                m.cat,
                                m.unidad,
                                m.stock,
                                m.min,
                                estadoTxt(m)
                            ];
                        }
                    )
                );
            },

            movimientos: function () {

                return tableFromRows(
                    [
                        'Fecha',
                        'Código',
                        'Tipo',
                        'Cantidad',
                        'Responsable',
                        'Referencia'
                    ],

                    db.movimientos.map(
                        function (x) {

                            return [
                                x.fecha,
                                x.cod,
                                x.tipo,
                                x.cant,
                                x.resp,
                                x.ref
                            ];
                        }
                    )
                );
            },

            pedidos: function () {

                return tableFromRows(
                    [
                        'Fecha',
                        'Proveedor',
                        'Código',
                        'Cantidad',
                        'Urgencia',
                        'Estado'
                    ],

                    db.pedidos.map(
                        function (p) {

                            return [
                                p.fecha,
                                p.prov,
                                p.cod,
                                p.cant,
                                p.urg,
                                p.estado
                            ];
                        }
                    )
                );
            },

            usuarios: function () {

                return tableFromRows(
                    [
                        'Nombre',
                        'Correo',
                        'Rol',
                        'Activo'
                    ],

                    db.usuarios.map(
                        function (u) {

                            return [
                                u.nombre,
                                u.correo,
                                u.rol,
                                u.activo
                                    ? 'Sí'
                                    : 'No'
                            ];
                        }
                    )
                );
            }
        };

        return data;
    }

    function tableFromRows(head, rows) {
        var t =
            document.createElement('table');

        t.innerHTML =
            '<tr>' +

            head.map(function (h) {
                return '<th>' +
                    esc(h) +
                    '</th>';
            }).join('') +

            '</tr>' +

            rows.map(function (r) {

                return '<tr>' +

                    r.map(function (c) {

                        return '<td>' +
                            esc(c) +
                            '</td>';

                    }).join('') +

                '</tr>';

            }).join('');

        return t;
    }

    function bindExports() {

        $$('[data-export]').forEach(
            function (b) {

                b.addEventListener(
                    'click',
                    function () {

                        var kind =
                            b.getAttribute(
                                'data-export'
                            );

                        if (kind === 'pdf') {
                            window.print();
                            return;
                        }

                        if (kind === 'chart') {

                            var c =
                                $('#charts');

                            if (c) {
                                c.scrollIntoView();
                            }

                            toast(
                                'Gráficos actualizados con el inventario actual.'
                            );

                            return;
                        }

                        if (kind === 'table') {

                            csvFrom(
                                $(
                                    b.getAttribute(
                                        'data-target'
                                    )
                                ),

                                b.getAttribute(
                                    'data-name'
                                ) ||
                                'datos'
                            );

                            return;
                        }

                        if (kind === 'modules') {

                            var marcados =
                                $$(
                                    'input[name="mod"]:checked'
                                );

                            var fmt =
                                $('input[name="fmt"]:checked');

                            if (!marcados.length) {

                                toast(
                                    'Selecciona al menos un módulo.'
                                );

                                return;
                            }

                            if (
                                fmt &&
                                fmt.value === 'pdf'
                            ) {
                                window.print();
                                return;
                            }

                            var ex =
                                exportModule();

                            marcados.forEach(
                                function (i) {

                                    csvFrom(
                                        ex[i.value](),

                                        'inventsoft-' +
                                        i.value
                                    );
                                }
                            );

                            toast(
                                'Descarga iniciada (Excel abre los archivos CSV).'
                            );
                        }
                    }
                );
            }
        );
    }

    /* ---------- login y recuperación ---------- */

    function auth() {

        var lf =
            $('#login-form');

        if (lf) {

            lf.addEventListener(
                'submit',
                function (e) {

                    e.preventDefault();

                    var u =
                        $('#correo')
                            .value
                            .trim();

                    var p =
                        $('#clave')
                            .value;

                    if (
                        u === 'admin@inventsoft.com' &&
                        p === 'admin1234'
                    ) {

                        location.href =
                            'dashboard.html';

                    } else {

                        $('#login-error').textContent =
                            'Correo o contraseña incorrectos. Usa las credenciales de demostración.';
                    }
                }
            );
        }

        var rf =
            $('#rec-form');

        if (rf) {

            rf.addEventListener(
                'submit',
                function (e) {

                    e.preventDefault();

                    toast(
                        'Si el correo existe, recibirás un enlace para restablecer la clave.'
                    );

                    rf.reset();
                }
            );
        }
    }

    document.addEventListener(
        'DOMContentLoaded',
        function () {

            shell();

            auth();

            renderDashboard();

            renderInventario();

            renderMovForm();

            renderStock();

            renderAlertas();

            renderPedidos();

            renderReportes();

            renderUsuarios();

            renderNiveles();

            bindExports();

            var b =
                $('#buscar');

            if (b) {
                b.addEventListener(
                    'input',
                    renderInventario
                );
            }

            var rst =
                $('#reset-demo');

            if (rst) {

                rst.addEventListener(
                    'click',
                    function () {

                        try {
                            localStorage.removeItem(
                                KEY
                            );
                        } catch (e) {}

                        location.reload();
                    }
                );
            }
        }
    );

})();