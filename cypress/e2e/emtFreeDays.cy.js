describe("send all free days to gmail", () => {
  let currentDate;

  before(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    currentDate = `${day}/${month}/${year}`;
  });

  beforeEach(() => {
    cy.visit(
      "https://miestacion.emtmadrid.es/Logon.aspx?returnurl=%2fConsultas%2fconsultaLibres.aspx"
    );
  });

  // login
  it("login in empoyee portal", () => {
    cy.get("h1").should("contain.text", "Login");
    cy.get("#p_lt_ctl02_EMTLogonForm_2FA_Login1_UserName")
      .as("username")
      .should("be.visible");
    cy.get("#p_lt_ctl02_EMTLogonForm_2FA_Login1_Password")
      .as("password")
      .should("be.visible");

    cy.get("@username").type("13923");
    cy.get("@password").type("1703Jr2009");
    cy.get("#p_lt_ctl02_EMTLogonForm_2FA_Login1_LoginButton")
      .as("btnSend")
      .should("be.visible");
    cy.get("@btnSend").click();

    cy.url("include", "https://miestacion.emtmadrid.es/Home.aspx");

    // select free days in list
    cy.get('a[href="/Consultas"]').invoke("show").trigger("mouseover");
    // cy.get("#mainNav > li:nth-child(1) > ul > li:nth-child(16) > a").trigger(
    //   "mouseover"
    // );
    cy.get(
      "#mainNav > li:nth-child(1) > ul > li:nth-child(16) > ul > li:nth-child(1) > a"
    ).click({ force: true });

    // select dates to search
    cy.get("#p_lt_ctl06_pageplaceholder_p_lt_ctl02_ConsultaLibres_txtFecha")
      .as("dateInit")
      .should("be.visible");
    cy.get("#p_lt_ctl06_pageplaceholder_p_lt_ctl02_ConsultaLibres_txtFechaFin")
      .as("dateEnd")
      .should("be.visible");

    cy.get("@dateInit").type("17/03/2009");
    cy.get("@dateEnd").type(currentDate);
    cy.get(
      "#p_lt_ctl06_pageplaceholder_p_lt_ctl02_ConsultaLibres_ddlTipoDia"
    ).select("Todos");

    cy.intercept(
      "POST",
      "https://miestacion.emtmadrid.es/Consultas/consultaLibres.aspx"
    ).as("post");

    cy.get(
      "#p_lt_ctl06_pageplaceholder_p_lt_ctl02_ConsultaLibres_btnEnviar"
    ).click();

    cy.wait("@post").then((interception) => {
      cy.log("post intercept", interception);
    });

    // send gmail
    cy.get(
      "#p_lt_ctl06_pageplaceholder_p_lt_ctl02_ConsultaLibres_btnEnviarLibres"
    )
      .as("btnEmail")
      .should("be.visible");
    cy.get("@btnEmail").click({ force: true });
    cy.contains(
      "Se ha enviado un correo con su consulta de días libres a la dirección juanjor99@gmail.com"
    ).should("be.visible");
  });
});
