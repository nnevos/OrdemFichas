import test from 'node:test';
import assert from 'node:assert/strict';
import {createDraft,renderWizard,wizardError,WIZARD_STEPS} from '../ordem/wizard.mjs';
import {derive} from '../ordem/rules.mjs';

test('seis etapas de criação e pontos iniciais distribuídos',()=>{
 const c=createDraft('camp','char');
 assert.equal(WIZARD_STEPS.length,6);
 assert.equal(Object.values(c.attrs).reduce((a,b)=>a+b,0),9);
 assert.equal(derive(c).current.pv,21);
 assert.match(renderWizard(c,0),/Nome do personagem/);
 assert.match(renderWizard(c,3),/Acrobacia/);
 assert.match(renderWizard(c,4),/Registrar ritual/);
});
test('nome é obrigatório e todos os graus e atributos podem ser editados livremente',()=>{
 const c=createDraft('camp','char');
 assert.match(wizardError(c,0),/nome/);
 c.name='Alice';assert.equal(wizardError(c,0),'');
 assert.equal(wizardError(c,1),'');
 c.attrs={agi:5,for:1,int:1,pre:1,vig:1};assert.equal(wizardError(c,2),'');
 const html=renderWizard(c,3);
 assert.match(html,/Expert · \+15/);
 assert.match(renderWizard(c,4),/open-ritual-catalog/);
});
test('campos do cadastro são escapados no HTML',()=>{
 const c=createDraft('camp','char');c.name='<img src=x onerror=alert(1)>';
 assert.doesNotMatch(renderWizard(c,0),/<img src=/);
});
