// متغيرات عامة لتنفيذ الخوارزمية
let variables = {};
let constants = {};
let inputQueue = [];
let waitingForInput = false;
let currentInputVar = null;
let algoritlmeLines = [];
let currentLineIndex = 0;

// دالة لإدراج قالب خوارزمية فارغ
function insertTemplate() {
    const template = `Algorithme: NomAlgorithme
// Déclaration des constantes
Const
    // Définir les constantes ici

// Déclaration des variables
Var
    // Définir les variables ici

Debut
    // Corps de l'algorithme ici

Fin`;
    document.getElementById("code-editor").value = template;
}

// دالة لمسح المحرر
function clearEditor() {
    document.getElementById("code-editor").value = "";
}

// دالة لإدراج كلمة مفتاحية في موضع المؤشر
function insertKeyword(keyword) {
    const editor = document.getElementById("code-editor");
    const cursorPos = editor.selectionStart;
    const textBefore = editor.value.substring(0, cursorPos);
    const textAfter = editor.value.substring(editor.selectionEnd);
    
    // التحقق مما إذا كنا بحاجة إلى إضافة سطر جديد قبل إدراج الكلمة المفتاحية
    const needNewLine = cursorPos > 0 && editor.value.charAt(cursorPos - 1) !== '\n';
    const textToInsert = needNewLine ? '\n' + keyword : keyword;
    
    editor.value = textBefore + textToInsert + textAfter;
    editor.focus();
    editor.selectionStart = editor.selectionEnd = cursorPos + textToInsert.length;
}

// دالة لتحميل أمثلة مختلفة
function loadExample(exampleNumber) {
    const codeEditor = document.getElementById("code-editor");
    
    switch(exampleNumber) {
        case 1:
            codeEditor.value = `Algorithme: SommeDeuxNombres
// Calcule la somme de deux nombres
Var
    a, b : Entier
    somme : Entier
Debut
    Ecrire("Entrez le premier nombre: ")
    Lire(a)
    Ecrire("Entrez le deuxième nombre: ")
    Lire(b)
    somme ← a + b
    Ecrire("La somme est: ", somme)
Fin`;
            break;
        case 2:
            codeEditor.value = `Algorithme: VerificationPariteNombre
// Vérifie si un nombre est pair ou impair
Var
    nombre : Entier
Debut
    Ecrire("Entrez un nombre entier: ")
    Lire(nombre)
    
    Si nombre mod 2 = 0 Alors
        Ecrire(nombre, " est un nombre pair")
    Sinon
        Ecrire(nombre, " est un nombre impair")
    FinSi
Fin`;
            break;
        case 3:
            codeEditor.value = `Algorithme: MoyenneDeSerie
// Calcule la moyenne d'une série de nombres
Var
    n, i : Entier
    nombre, somme, moyenne : Réel
Debut
    somme ← 0
    
    Ecrire("Combien de nombres voulez-vous entrer? ")
    Lire(n)
    
    Pour i de 1 à n Faire
        Ecrire("Entrez le nombre ", i, ": ")
        Lire(nombre)
        somme ← somme + nombre
    FinPour
    
    moyenne ← somme / n
    Ecrire("La moyenne des ", n, " nombres est: ", moyenne)
Fin`;
            break;
        case 4:
            codeEditor.value = `Algorithme: CalculGCD
// Calcule le plus grand diviseur commun (GCD) de deux nombres
Var
    a, b, temp : Entier
Debut
    Ecrire("Entrez le premier nombre: ")
    Lire(a)
    Ecrire("Entrez le deuxième nombre: ")
    Lire(b)
    
    // Algorithme d'Euclide
    Tant Que b ≠ 0 Faire
        temp ← b
        b ← a mod b
        a ← temp
    FinTantQue
    
    Ecrire("Le GCD est: ", a)
Fin`;
            break;
    }
}

// دالة لفحص الخوارزمية والتحقق من الأخطاء
function checkAlgorithm() {
    const code = document.getElementById("code-editor").value;
    const output = document.getElementById("output");
    output.innerHTML = "";
    
    // فحص الهيكل العام للخوارزمية
    if (!code.includes("Algorithme:")) {
        appendOutput("خطأ: لم يتم العثور على كلمة 'Algorithme:' في بداية الخوارزمية", "error");
        return;
    }
    
    if (!code.includes("Debut")) {
        appendOutput("خطأ: لم يتم العثور على كلمة 'Debut' في الخوارزمية", "error");
        return;
    }
    
    if (!code.includes("Fin")) {
        appendOutput("خطأ: لم يتم العثور على كلمة 'Fin' في نهاية الخوارزمية", "error");
        return;
    }

    // تحليل الكود وتقسيمه إلى أقسام
    try {
        parseAlgorithm(code);
        appendOutput("تم التحقق من الخوارزمية بنجاح!", "success");
    } catch (error) {
        appendOutput("خطأ: " + error.message, "error");
    }
}

// دالة لتحليل الخوارزمية وتقسيمها إلى أقسام
function parseAlgorithm(code) {
    // إعادة تعيين المتغيرات العامة
    variables = {};
    constants = {};
    algoritlmeLines = [];
    currentLineIndex = 0;
    
    // تقسيم الكود إلى أسطر
    const lines = code.split('\n').map(line => line.trim());
    
    // استخراج اسم الخوارزمية
    const algorithmNameLine = lines.find(line => line.startsWith("Algorithme:"));
    if (!algorithmNameLine) {
        throw new Error("لم يتم العثور على اسم الخوارزمية");
    }
    
    // تحليل قسم الثوابت (Constants)
    let constSection = false;
    let varSection = false;
    let mainSection = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.startsWith("Const")) {
            constSection = true;
            varSection = false;
            mainSection = false;
            continue;
        } else if (line.startsWith("Var")) {
            constSection = false;
            varSection = true;
            mainSection = false;
            continue;
        } else if (line.startsWith("Debut")) {
            constSection = false;
            varSection = false;
            mainSection = true;
            continue;
        } else if (line.startsWith("Fin")) {
            mainSection = false;
            continue;
        }
        
        // تجاهل التعليقات والأسطر الفارغة
        if (line.startsWith("//") || line === "") continue;
        
        if (constSection) {
            parseConstantDeclaration(line);
        } else if (varSection) {
            parseVariableDeclaration(line);
        } else if (mainSection) {
            algoritlmeLines.push(line);
        }
    }
    
    // التحقق من توازن بنية التحكم
    checkControlStructures(algoritlmeLines);
}

// دالة لتحليل تعريفات الثوابت
function parseConstantDeclaration(line) {
    if (!line || line.trim() === "") return;
    
    // نمط لتحليل تعريف الثابت: اسم_الثابت = قيمة
    const constMatch = line.match(/^\s*([a-zA-Z][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
    if (constMatch) {
        const constName = constMatch[1];
        const constValue = evaluateExpression(constMatch[2]);
        constants[constName] = constValue;
    } else {
        throw new Error("خطأ في تعريف الثابت: " + line);
    }
}

// دالة لتحليل تعريفات المتغيرات
function parseVariableDeclaration(line) {
    if (!line || line.trim() === "") return;
    
    // التحقق من وجود الفاصلة النقطية
    if (line.includes(":")) {
        const parts = line.split(":");
        const varNames = parts[0].split(",").map(v => v.trim());
        const varType = parts[1].trim();
        
        // تسجيل كل متغير مع نوعه
        for (const varName of varNames) {
            if (varName) {
                variables[varName] = {
                    type: varType,
                    value: null
                };
            }
        }
    } else {
        // هذا ليس تعريف متغير صحيح
        if (line.length > 0 && !line.startsWith("//")) {
            throw new Error("خطأ في تعريف المتغير: " + line);
        }
    }
}

// دالة للتحقق من توازن بنية التحكم
function checkControlStructures(lines) {
    let siCount = 0;
    let finSiCount = 0;
    let pourCount = 0;
    let finPourCount = 0;
    let tantQueCount = 0;
    let finTantQueCount = 0;
    
    for (const line of lines) {
        if (line.startsWith("Si ")) siCount++;
        if (line.startsWith("FinSi")) finSiCount++;
        if (line.startsWith("Pour ")) pourCount++;
        if (line.startsWith("FinPour")) finPourCount++;
        if (line.startsWith("Tant Que ")) tantQueCount++;
        if (line.startsWith("FinTantQue")) finTantQueCount++;
    }
    
    if (siCount !== finSiCount) {
        throw new Error(`عدم توازن في بنية Si/FinSi. عدد فتح: ${siCount}, عدد إغلاق: ${finSiCount}`);
    }
    
    if (pourCount !== finPourCount) {
        throw new Error(`عدم توازن في بنية Pour/FinPour. عدد فتح: ${pourCount}, عدد إغلاق: ${finPourCount}`);
    }
    
    if (tantQueCount !== finTantQueCount) {
        throw new Error(`عدم توازن في بنية Tant Que/FinTantQue. عدد فتح: ${tantQueCount}, عدد إغلاق: ${finTantQueCount}`);
    }
}

// دالة لتنفيذ الخوارزمية
function executeAlgorithm() {
    const code = document.getElementById("code-editor").value;
    const output = document.getElementById("output");
    output.innerHTML = "";
    
    try {
        // تحليل الخوارزمية أولاً
        parseAlgorithm(code);
        
        // إعادة تعيين حالة التنفيذ
        currentLineIndex = 0;
        inputQueue = [];
        waitingForInput = false;
        
        // إظهار زر الإدخال وحقل الإدخال
        document.getElementById("input-container").style.display = "flex";
        
        appendOutput("بدء تنفيذ الخوارزمية...", "info");
        executeNextLine();
    } catch (error) {
        appendOutput("خطأ: " + error.message, "error");
    }
}

// دالة لتنفيذ السطر التالي من الخوارزمية
function executeNextLine() {
    if (currentLineIndex >= algoritlmeLines.length) {
        appendOutput("انتهى تنفيذ الخوارزمية بنجاح.", "success");
        document.getElementById("input-container").style.display = "none";
        return;
    }
    
    if (waitingForInput) {
        return; // في انتظار إدخال المستخدم
    }
    
    const line = algoritlmeLines[currentLineIndex];
    try {
        executeLine(line);
        currentLineIndex++;
        
        // تنفيذ السطر التالي بشكل تلقائي إذا لم نكن في انتظار إدخال
        if (!waitingForInput) {
            setTimeout(executeNextLine, 100);
        }
    } catch (error) {
        appendOutput(`خطأ في السطر ${currentLineIndex + 1}: ${error.message}`, "error");
        document.getElementById("input-container").style.display = "none";
    }
}

// دالة لتنفيذ سطر واحد من الخوارزمية
function executeLine(line) {
    if (!line || line.trim() === "" || line.startsWith("//")) {
        return; // تجاهل السطر الفارغ أو التعليق
    }
    
    // تحليل وتنفيذ الأوامر المختلفة
    if (line.startsWith("Ecrire(")) {
        executeEcrire(line);
    } else if (line.startsWith("Lire(")) {
        executeLire(line);
    } else if (line.match(/^[a-zA-Z][a-zA-Z0-9_]*\s*←/)) {
        executeAssignment(line);
    } else if (line.startsWith("Si ")) {
        executeIfStatement(line);
    } else if (line.startsWith("Pour ")) {
        executeForLoop(line);
    } else if (line.startsWith("Tant Que ")) {
        executeWhileLoop(line);
    } else if (line === "Sinon" || line === "FinSi" || line === "

// دالة لتنفيذ أمر Ecrire (الطباعة)
function executeEcrire(line) {
    // استخراج محتوى الطباعة بين الأقواس
    const matchContent = line.match(/Ecrire\((.*)\)/);
    if (matchContent) {
        const content = matchContent[1];
        // تقسيم المحتوى إذا كان هناك عدة عناصر مفصولة بفواصل
        const parts = parseParameters(content);
        let outputText = "";
        
        // معالجة كل جزء من أجزاء الطباعة
        for (const part of parts) {
            if (part.startsWith('"') && part.endsWith('"')) {
                // إذا كان نص حرفي داخل علامات اقتباس
                outputText += part.substring(1, part.length - 1);
            } else {
                // إذا كان متغير أو تعبير، قم بتقييمه
                const value = evaluateExpression(part);
                outputText += value;
            }
        }
        
        appendOutput(outputText, "output");
    } else {
        throw new Error("صيغة Ecrire غير صحيحة: " + line);
    }
}

// دالة لتنفيذ أمر Lire (القراءة)
function executeLire(line) {
    // استخراج اسم المتغير من داخل الأقواس
    const matchVarName = line.match(/Lire\(([a-zA-Z][a-zA-Z0-9_]*)\)/);
    if (matchVarName) {
        const varName = matchVarName[1];
        
        // التحقق من وجود المتغير
        if (!variables[varName]) {
            throw new Error("متغير غير معرف: " + varName);
        }
        
        // وضع علامة على أننا في انتظار إدخال
        waitingForInput = true;
        currentInputVar = varName;
        
        // طلب الإدخال من المستخدم
        appendOutput("الرجاء إدخال قيمة لـ " + varName + ":", "input-prompt");
        document.getElementById("user-input").focus();
    } else {
        throw new Error("صيغة Lire غير صحيحة: " + line);
    }
}

// دالة لمعالجة الإدخال من المستخدم
function processInput() {
    const inputElement = document.getElementById("user-input");
    const inputValue = inputElement.value.trim();
    inputElement.value = "";
    
    if (waitingForInput && currentInputVar) {
        try {
            // تحويل القيمة المدخلة حسب نوع المتغير
            let parsedValue;
            const varType = variables[currentInputVar].type;
            
            if (varType === "Entier") {
                parsedValue = parseInt(inputValue);
                if (isNaN(parsedValue)) {
                    throw new Error("يجب إدخال قيمة عددية صحيحة");
                }
            } else if (varType === "Réel") {
                parsedValue = parseFloat(inputValue);
                if (isNaN(parsedValue)) {
                    throw new Error("يجب إدخال قيمة عددية");
                }
            } else if (varType === "Chaine" || varType === "Chaîne") {
                parsedValue = inputValue;
            } else if (varType === "Booléen" || varType === "Booleen") {
                if (inputValue.toLowerCase() === "vrai" || inputValue.toLowerCase() === "true") {
                    parsedValue = true;
                } else if (inputValue.toLowerCase() === "faux" || inputValue.toLowerCase() === "false") {
                    parsedValue = false;
                } else {
                    throw new Error("يجب إدخال قيمة منطقية (vrai/faux)");
                }
            } else {
                parsedValue = inputValue;
            }
            
            // تخزين القيمة في المتغير
            variables[currentInputVar].value = parsedValue;
            appendOutput(`تم تخزين القيمة '${parsedValue}' في ${currentInputVar}`, "info");
            
            // إعادة تعيين حالة الإدخال
            waitingForInput = false;
            currentInputVar = null;
            
            // استئناف التنفيذ
            currentLineIndex++;
            setTimeout(executeNextLine, 100);
        } catch (error) {
            appendOutput("خطأ في الإدخال: " + error.message, "error");
            // السماح بإعادة المحاولة
            document.getElementById("user-input").focus();
        }
    }
}

// دالة لتنفيذ عملية الإسناد (التعيين)
function executeAssignment(line) {
    // استخراج اسم المتغير والتعبير
    const assignmentMatch = line.match(/^([a-zA-Z][a-zA-Z0-9_]*)\s*←\s*(.+)$/);
    if (assignmentMatch) {
        const varName = assignmentMatch[1];
        const expression = assignmentMatch[2];
        
        // التحقق من وجود المتغير
        if (!variables[varName]) {
            throw new Error("متغير غير معرف: " + varName);
        }
        
        // تقييم التعبير وتخزين النتيجة
        const value = evaluateExpression(expression);
        variables[varName].value = value;
        
        appendOutput(`${varName} ← ${value}`, "assignment");
    } else {
        throw new Error("صيغة الإسناد غير صحيحة: " + line);
    }
}

// دالة لتنفيذ جملة الشرط (If)
function executeIfStatement(line) {
    // استخراج الشرط
    const conditionMatch = line.match(/Si\s+(.+)\s+Alors$/);
    if (!conditionMatch) {
        throw new Error("صيغة جملة Si غير صحيحة: " + line);
    }
    
    const condition = conditionMatch[1];
    const isTrue = evaluateCondition(condition);
    
    // البحث عن نهاية كتلة Si (FinSi) أو كتلة Sinon
    let blockEndIndex = findBlockEnd(currentLineIndex, "Si", "FinSi");
    let elseIndex = findElse(currentLineIndex, blockEndIndex);
    
    if (isTrue) {
        // الشرط صحيح، استمر في التنفيذ
        appendOutput(`الشرط [${condition}] = صحيح، تنفيذ كتلة Si`, "control");
    } else {
        // الشرط غير صحيح، انتقل إلى كتلة Sinon أو FinSi
        appendOutput(`الشرط [${condition}] = خاطئ، تخطي كتلة Si`, "control");
        if (elseIndex !== -1) {
            currentLineIndex = elseIndex; // انتقل إلى كتلة Sinon
        } else {
            currentLineIndex = blockEndIndex; // انتقل إلى FinSi
        }
    }
}

// دالة للبحث عن Sinon بين الأسطر المحددة
function findElse(startIndex, endIndex) {
    for (let i = startIndex + 1; i < endIndex; i++) {
        if (algoritlmeLines[i].trim() === "Sinon") {
            return i;
        }
    }
    return -1;
}

// دالة لتنفيذ جملة التكرار (Pour)
function executeForLoop(line) {
    // استخراج متغير التكرار والقيم
    const forMatch = line.match(/Pour\s+([a-zA-Z][a-zA-Z0-9_]*)\s+de\s+(.+)\s+à\s+(.+)\s+Faire$/);
    if (!forMatch) {
        throw new Error("صيغة حلقة Pour غير صحيحة: " + line);
    }
    
    const loopVar = forMatch[1];
    const startValue = evaluateExpression(forMatch[2]);
    const endValue = evaluateExpression(forMatch[3]);
    
    // إنشاء متغير التكرار إذا لم يكن موجوداً
    if (!variables[loopVar]) {
        variables[loopVar] = { type: "Entier", value: startValue };
    } else {
        variables[loopVar].value = startValue;
    }
    
    // البحث عن نهاية حلقة التكرار
    const blockEndIndex = findBlockEnd(currentLineIndex, "Pour", "FinPour");
    
    // حفظ معلومات حلقة التكرار
    const loopInfo = {
        type: "Pour",
        variable: loopVar,
        startValue: startValue,
        endValue: endValue,
        bodyStartIndex: currentLineIndex + 1,
        bodyEndIndex: blockEndIndex - 1,
        iteration: 1
    };
    
    // التحقق مما إذا كانت الحلقة ستنفذ
    if (startValue <= endValue) {
        appendOutput(`بدء حلقة Pour مع ${loopVar} = ${startValue}`, "control");
        // حفظ معلومات الحلقة في المكدس (stack)
        pushLoopInfo(loopInfo);
    } else {
        // الحلقة لن تنفذ، انتقل إلى FinPour
        appendOutput(`تخطي حلقة Pour (${startValue} > ${endValue})`, "control");
        currentLineIndex = blockEndIndex;
    }
}

// دالة لتنفيذ جملة التكرار الشرطي (Tant Que)
function executeWhileLoop(line) {
    // استخراج الشرط
    const whileMatch = line.match(/Tant\s+Que\s+(.+)\s+Faire$/);
    if (!whileMatch) {
        throw new Error("صيغة حلقة Tant Que غير صحيحة: " + line);
    }
    
    const condition = whileMatch[1];
    const isTrue = evaluateCondition(condition);
    
    // البحث عن نهاية حلقة التكرار
    const blockEndIndex = findBlockEnd(currentLineIndex, "Tant Que", "FinTantQue");
    
    // التحقق مما إذا كان الشرط صحيحاً
    if (isTrue) {
        appendOutput(`الشرط [${condition}] = صحيح، تنفيذ حلقة Tant Que`, "control");
        
        // حفظ معلومات الحلقة في المكدس
        const loopInfo = {
            type: "TantQue",
            condition: condition,
            bodyStartIndex: currentLineIndex + 1,
            bodyEndIndex: blockEndIndex - 1,
            iteration: 1
        };
        pushLoopInfo(loopInfo);
    } else {
        // الشرط غير صحيح، انتقل إلى FinTantQue
        appendOutput(`الشرط [${condition}] = خاطئ، تخطي حلقة Tant Que`, "control");
        currentLineIndex = blockEndIndex;
    }
}

// دالة للبحث عن نهاية كتلة (Block)
function findBlockEnd(startIndex, startKeyword, endKeyword) {
    let depth = 1;
    let i = startIndex + 1;
    
    while (i < algoritlmeLines.length && depth > 0) {
        const line = algoritlmeLines[i].trim();
        
        if (line.startsWith(startKeyword + " ")) {
            depth++;
        } else if (line === endKeyword) {
            depth--;
        }
        
        if (depth === 0) {
            return i;
        }
        
        i++;
    }
    
    throw new Error(`لم يتم العثور على ${endKeyword} المقابل لـ ${startKeyword}`);
}

// دالة لتقييم التعبيرات الحسابية والمنطقية
function evaluateExpression(expression) {
    if (!expression) return null;
    
    expression = expression.trim();
    
    // التحقق من القيم المباشرة (أعداد، نصوص، قيم منطقية)
    if (expression === "vrai" || expression === "true") return true;
    if (expression === "faux" || expression === "false") return false;
    
    // إذا كان نص حرفي
    if (expression.startsWith('"') && expression.endsWith('"')) {
        return expression.substring(1, expression.length - 1);
    }
    
    // التحقق من وجود المتغير
    if (/^[a-zA-Z][a-zA-Z0-9_]*$/.test(expression)) {
        if (variables[expression]) {
            return variables[expression].value;
        } else if (constants[expression]) {
            return constants[expression];
        } else {
            throw new Error("متغير أو ثابت غير معرف: " + expression);
        }
    }
    
    // تحويل العمليات الحسابية والمنطقية
    expression = expression.replace(/\bmod\b/g, "%");  // تحويل mod إلى %
    expression = expression.replace(/\bdiv\b/g, "/");  // تحويل div إلى /
    expression = expression.replace(/\bet\b/g, "&&");  // تحويل et إلى &&
    expression = expression.replace(/\bou\b/g, "||");  // تحويل ou إلى ||
    expression = expression.replace(/\bnon\b/g, "!");  // تحويل non إلى !
    expression = expression.replace(/=/g, "==");       // تحويل = إلى ==
    expression = expression.replace(/≠/g, "!=");       // تحويل ≠ إلى !=
    expression = expression.replace(/≤/g, "<=");       // تحويل ≤ إلى <=
    expression = expression.replace(/≥/g, ">=");       // تحويل ≥ إلى >=
    
    // استبدال المتغيرات بقيمها

