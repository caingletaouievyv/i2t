# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY i2t-Api/*.csproj ./ 
RUN dotnet restore "i2t-Api.csproj"

# Copy source and publish
COPY i2t-Api/. ./ 
RUN dotnet publish "i2t-Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install Tesseract + dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    hunspell \
    hunspell-en-us \
    && rm -rf /var/lib/apt/lists/*

# Fix for .NET Tesseract wrapper looking for wrong filename
RUN ln -s /usr/lib/x86_64-linux-gnu/liblept.so.5 \
          /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so || true

# Copy published app
COPY --from=build /app/publish .

# Copy tessdata (OCR models)
COPY i2t-Api/tessdata /usr/share/tesseract-ocr/4.00/tessdata
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

# Copy Hunspell dictionaries
COPY i2t-Api/Dictionaries /usr/share/hunspell

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
