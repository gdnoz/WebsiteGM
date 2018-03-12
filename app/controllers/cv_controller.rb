class CvController < ApplicationController
    def index
        pdf_filename = File.join(Rails.root, "app/assets/files/GM_CV.pdf")
        send_file(pdf_filename, :filename => "GM_CV.pdf", :type => "application/pdf", :disposition => 'inline')
    end
end
