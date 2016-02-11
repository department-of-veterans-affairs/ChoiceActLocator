/**
 *Class Name: ProvidersFeatureLayer
 *
 *  A helper class for dealing with the Provider List feature layer
 */		
require([
    "dojo/_base/declare",
            "dojo/dom",
        "dojo/_base/lang"
], function(declare,dom, lang){
    return declare("ProviderFeatureLayer",null, {
        
        constructor: function(){	
        
            this.providerFieldName = "Provider";
            this.providerFirstName = "ProviderFirstName";
            this.providerLastName = "ProviderSurName";
            this.providerSuffix = "ProviderSuffix";
            this.providerDegree = "Degree";
            this.providerSex = "Sex";
            this.prescribingProvider = "PrescribingProvider";
            this.addressFieldName = "AddressLine";
            this.address2FieldName = "AddressLine2";
            this.specialityFieldName = "SpecialtyVACategories";
            this.specialityTPAFieldName = "SpecialtyTPACategories";
            this.specialityGroup = "SpecGroup";
            this.groupname = "GroupName";
            this.cityFieldName = "City";
            this.stateFieldName = "State";
            this.zipFieldName = "Zip_1";
            this.VISNFieldName = "VISN";
            this.triWestOrHealthNet = "TWHN"
            this.choiceOrPC3 = "ChoicePC3"
            this.regionFieldName = "Region";
            this.networkFieldName = "Network"
            this.typeFieldName = "Type";
            this.categoryFieldName = "Category";
            this.uIDFieldName = "FID";
            this.uniqueProviderCode = 'UniqueProviderCode'
            
        },
        getUniqueProviderTypes: function(){
             return ['Acupuncture','Allergy, Asthma, and Immunology','Ambulance',
                     'Ambulatory Surgery Center','Anesthesiology','Audiology',
                     'Behavioral Medicine','Cardiology','Chiropractor','Dentistry',
                     'Dermatology','Dialysis','Diet and Nutrition',
                     'Emergency Medicine / Critical Care Medicine','Endocrinology',
                     'Ent (Ears/Nose/Throat) -Otorhinolaryngology','Gastroenterology',
                     'Genetics','Gerontology','Hematology','Home Health',
                     'Hospice and Pallative Care','Hospital/Facility','Infectious Diseases',
                     'Infusion Therapy','Laboratory','Medical Supply','Neonatal-Perinatal',
                     'Nephrology','Neurology','Ob/Gyn','Oncology','Ophthalmology',
                     'Optometry','Orthopedics','Other','Pain Management','Pathology',
                     'Pediatric Specialties','Pharmacy','Physical Med/Rehabilitation',
                     'Podiatry','Primary Care','Proctology','Pulmonary Disease',
                     'Radiology / Diagnostic Imaging','Rheumatology','Surgery','Urology'];
        }
    
    });
}); 